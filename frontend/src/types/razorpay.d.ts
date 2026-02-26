export { }; // Ensure file is a module

declare global {
    interface Window {
        Razorpay: any;
    }
}
