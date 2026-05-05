import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../api/auth";
import { useMutation } from "@tanstack/react-query";

export const LandingPage = () => {
    const loginWithGoogleMutation = useMutation({
        mutationFn: authApi.loginWithGoogle,
        onSuccess: () => {
            console.log('Login successful');
            // TODO: handle successful login, e.g. store user data, redirect, etc.
        },
        onError: (error) => {
            console.log("Login failed:", error);
        },
    });
    return (
        <div>
            *insert landing page here*
            <GoogleLogin
            onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) {
                    console.log('No credential received');
                    return;
                }
                loginWithGoogleMutation.mutate(credentialResponse.credential);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            auto_select={true}
        />
        </div>

    )
};