import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Types
interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id?: number;
  order_data?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyPaymentRequest = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, order_data } = body;

    console.log('🔄 Verifying payment and completing order:', {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      internalOrderId: order_id
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required payment parameters'
        },
        { status: 400 }
      );
    }

    // Create the signature body
    const bodyString = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(bodyString)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    console.log('🔐 Signature verification:', {
      isAuthentic,
      expectedSignature: expectedSignature.substring(0, 10) + '...',
      receivedSignature: razorpay_signature.substring(0, 10) + '...'
    });

    if (!isAuthentic) {
      console.log('❌ Payment verification failed for payment ID:', razorpay_payment_id);
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed - invalid signature',
          data: {
            signatureValid: false,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id
          },
        },
        { status: 400 }
      );
    }

    console.log('✅ Payment verified successfully for payment ID:', razorpay_payment_id);

    // If order_id is provided, call backend to complete the order
    let completedOrder = null;
    if (order_id) {
      try {
        console.log('📦 Completing order after payment verification...');
        
        // Call your Laravel backend to complete the order
        const completeOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            order_id
          })
        });

        if (!completeOrderResponse.ok) {
          const errorData = await completeOrderResponse.json();
          throw new Error(errorData.message || 'Failed to complete order');
        }

        const orderResult = await completeOrderResponse.json();
        
        if (orderResult.success) {
          completedOrder = orderResult.data;
          console.log('✅ Order completed successfully:', completedOrder.order_number);
        } else {
          throw new Error(orderResult.message || 'Order completion failed');
        }

      } catch (orderError: any) {
        console.error('❌ Order completion failed after payment:', orderError);
        // Even if order completion fails, payment is still verified
        // You might want to handle this scenario (manual intervention needed)
        return NextResponse.json(
          {
            success: false,
            message: 'Payment verified but order completion failed. Please contact support.',
            data: {
              signatureValid: true,
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              verifiedAt: new Date().toISOString(),
              orderCompleted: false
            }
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully' + (completedOrder ? ' and order completed' : ''),
      data: {
        signatureValid: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        verifiedAt: new Date().toISOString(),
        order: completedOrder,
        orderCompleted: !!completedOrder
      },
    });

  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during payment verification',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
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