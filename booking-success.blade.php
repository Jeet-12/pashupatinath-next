<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Success - Rudrakshi Astrologer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-md-6">
                <div class="card border-0 shadow-lg">
                    <div class="card-body text-center p-5">
                        <div class="text-success mb-4">
                            <i class="fas fa-check-circle fa-5x"></i>
                        </div>
                        <h2 class="text-primary mb-3">Booking Confirmed!</h2>
                        <p class="lead mb-4">Your astrology session has been successfully booked.</p>
                        
                        <div class="booking-details text-start bg-light p-4 rounded mb-4">
                            <h5 class="mb-3">Booking Details:</h5>
                            <p><strong>Name:</strong> {{ $booking->name }}</p>
                            <p><strong>Email:</strong> {{ $booking->email }}</p>
                            <p><strong>Mobile:</strong> {{ $booking->mobile }}</p>
                            <p><strong>Time Slot:</strong> {{ $booking->selected_slot }}</p>
                            <p><strong>Booking ID:</strong> #{{ $booking->id }}</p>
                        </div>
                        
                        <p class="text-muted mb-4">
                            Our astrologer will contact you at your selected time slot. 
                            Please keep your phone available.
                        </p>
                        
                        <div class="d-grid gap-2">
                            <a href="{{ route('astrologer.booking') }}" class="btn btn-primary">
                                <i class="fas fa-calendar-plus"></i> Book Another Session
                            </a>
                            <a href="/" class="btn btn-outline-secondary">
                                <i class="fas fa-home"></i> Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>