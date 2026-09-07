import { connectToDatabase } from "@/lib/db";
import { DonationModel } from "@/lib/models/donation";
import { getPaystackConfig, PaymentServiceError, transactionMatchesDonation, verifyPaystackTransaction } from "./paystack";

export async function reconcileDonation(reference: string) {
  await connectToDatabase();
  const donation = await DonationModel.findOne({ reference });
  if (!donation) return null;
  if (donation.status === "successful") return donation;
  if (donation.environment !== getPaystackConfig().environment) {
    throw new PaymentServiceError("This donation belongs to a different Paystack environment.", 409);
  }

  const transaction = await verifyPaystackTransaction(reference);
  if (!transactionMatchesDonation(transaction, donation)) {
    throw new PaymentServiceError("Payment details could not be matched. Please contact us with your donation reference.", 409);
  }

  if (transaction.status === "success") {
    await DonationModel.updateOne(
      { reference, status: { $ne: "successful" } },
      { $set: {
        status: "successful",
        transactionId: transaction.id,
        channel: transaction.channel,
        paidAt: transaction.paid_at ? new Date(transaction.paid_at) : new Date(),
      } },
    );
  } else if (["abandoned", "failed", "reversed"].includes(transaction.status)) {
    await DonationModel.updateOne(
      { reference, status: { $ne: "successful" } },
      { $set: { status: "failed", channel: transaction.channel } },
    );
  }

  return DonationModel.findOne({ reference });
}

export function donationPaymentSummary(donation: NonNullable<Awaited<ReturnType<typeof reconcileDonation>>>) {
  return {
    status: donation.status,
    amount: donation.amount,
    currency: donation.currency,
    reference: donation.reference,
    environment: donation.environment,
    paidAt: donation.paidAt ?? null,
    checkoutUrl: donation.status !== "successful" ? donation.checkoutUrl ?? null : null,
  };
}
