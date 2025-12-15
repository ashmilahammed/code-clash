import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyForgotOtpApi, resendOtpApi } from "../../api/authApi";



const RESEND_COOLDOWN = 30; // seconds

const ForgotVerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const userId = new URLSearchParams(location.search).get("userId");

    if (!userId) {
        return <p>Error: User ID missing. Go back and try again.</p>;
    }

    // countdown timer
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!otp.trim()) {
            setError("OTP cannot be empty");
            return;
        }

        try {
            setLoading(true);
            await verifyForgotOtpApi({ userId, otp });
            navigate(`/auth/reset-password?userId=${userId}`);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;

        try {
            setResending(true);
            setError(null);
            setMessage(null);

            await resendOtpApi({ userId, ignoreVerified: true, });

            setMessage("OTP resent successfully");
            setCooldown(RESEND_COOLDOWN);

        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };


    //
    return (
        <form onSubmit={handleSubmit}>
            <h2>Verify OTP</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
            />

            <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP */}
            <p
                onClick={cooldown > 0 || resending ? undefined : handleResendOtp}
                style={{
                    marginTop: "10px",
                    color: cooldown > 0 ? "gray" : "blue",
                    cursor: cooldown > 0 ? "not-allowed" : "pointer",
                }}
            >
                {cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : resending
                        ? "Resending OTP..."
                        : "Resend OTP"}
            </p>
        </form>
    );
};

export default ForgotVerifyOtp;
