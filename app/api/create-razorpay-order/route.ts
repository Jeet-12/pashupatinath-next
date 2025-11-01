import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';


interface RazorpayOrderCreateRequestBody {
  amount: number;
  currency: string;
  receipt?: string;
  payment_capture?: 1 | 0;
  notes?: Record<string, any>;
}

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, address_id, coupon_code, referral_code } = body;

    if (!amount) {
      return NextResponse.json(
        { success: false, message: 'Amount is required' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { success: false, message: 'Amount must be at least ₹1 (100 paise)' },
        { status: 400 }
      );
    }

    const options: RazorpayOrderCreateRequestBody = {
      amount: Math.round(amount),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        order_type: 'product_purchase',
        address_id,
        coupon_code,
        referral_code,
        created_at: new Date().toISOString(),
      },
    };

    // ✅ Safely cast to any (since Razorpay’s types are inconsistent)
    const order = await razorpay.orders.create(options as any);

    console.log('✅ Razorpay order created:', order.id);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while creating payment order',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// ✅ Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
