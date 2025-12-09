// src/components/Checkout/CheckoutForm.tsx
'use client'

import { createOrder, verifyPayment } from "@/actions";
import { createPayment } from "@/actions/createPayment";
import { ICartItem } from "@/types";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

// Add Razorpay type definition for window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutForm({ cartItems, total, userEmail }: { cartItems: ICartItem[], total: number, userEmail: string }) {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = async (formData: FormData) => {
    startTransition(async () => {
      try {
        // 1. Create Internal Order
        const { orderId } = await createOrder(formData);

        // 2. Create Razorpay Order
        const { orderId: razorpayOrderId } = await createPayment({
          orderId,
          amount: total,
        });

        // 3. Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
            amount: Math.round(total * 100),
            currency: "INR",
            name: "Your Store Name",
            description: "Payment for Order #" + orderId.slice(-6),
            order_id: razorpayOrderId,
            handler: async function (response: any) {
              // 4. Verify Payment on Server
              await verifyPayment(
                razorpayOrderId,
                response.razorpay_payment_id,
                response.razorpay_signature,
                orderId
              );
            },
            prefill: {
              email: userEmail,
            },
            theme: {
              color: "#000000",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };

      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Something went wrong with checkout. Please try again.");
      }
    });
  };

  return (
    <form action={handleCheckout} className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Shipping Address</label>
        <textarea
          name="shippingAddr"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          rows={4}
          placeholder="Enter your full street address, city, and pincode..."
          required
          minLength={10}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded mb-6 text-sm text-gray-600">
        <p>Your order contains <strong>{cartItems.length} items</strong>.</p>
        <p className="font-bold mt-1 text-black">Total to Pay: ₹{total.toFixed(2)}</p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" /> Processing...
          </>
        ) : (
          `Pay Securely`
        )}
      </button>
    </form>
  );
}