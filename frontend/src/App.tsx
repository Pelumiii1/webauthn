import { useState } from "react";
import { base64urlToBuffer, bufferToBase64url } from "./utils/webauthn";

const App = () => {
  const [name, setName] = useState("");

  async function handleLogin() {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: name }),
      });
      const options = await res.json();

      options.challenge = base64urlToBuffer(options.challenge);

      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (cred: any) => ({
            ...cred,
            id: base64urlToBuffer(cred.id),
          })
        );
      }
      const assertion = await navigator.credentials.get({
        publicKey: options,
      });

      if (!assertion) {
        alert("No credentials found!");
        return;
      }

      const auth = assertion as PublicKeyCredential;

      await fetch("http://127.0.0.1:8000/auth/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: {
            id: auth.id,
            rawId: bufferToBase64url(auth.rawId),
            type: auth.type,
            response: {
              clientDataJSON: bufferToBase64url(auth.response.clientDataJSON),
              authenticatorData: bufferToBase64url(
                (auth.response as AuthenticatorAssertionResponse)
                  .authenticatorData
              ),
              signature: bufferToBase64url(
                (auth.response as AuthenticatorAssertionResponse).signature
              ),
              userHandle: auth.response.userHandle
                ? bufferToBase64url(auth.response.userHandle)
                : null,
            },
          },
        }),
      });
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  }
  async function handleRegister() {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: name,
          email: name + "@example.com",
        }),
      });
      const options = await res.json();
      options.challenge = base64urlToBuffer(options.challenge);
      options.user.id = base64urlToBuffer(options.user.id);

      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      const attestation = credential as PublicKeyCredential;

      await fetch("http://127.0.0.1:8000/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: attestation.id,
          rawId: bufferToBase64url(attestation.rawId),
          type: attestation.type,
          response: {
            clientDataJSON: bufferToBase64url(
              attestation.response.clientDataJSON
            ),
            attestationObject: bufferToBase64url(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (attestation.response as any).attestationObject
            ),
          },
        }),
      });
      alert("Registration successful!");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center md:max-w-125 mx-auto px-10">
      <div className="mb-5 text-center">
        <h1 className="font-black">Welcome to WebAuthn!</h1>
        <p>This is a simple demo of WebAuthn authentication.</p>
      </div>

      <div className="grid w-full">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />

        <button className="bg-black text-white py-2 mb-4" onClick={handleLogin}>
          Login
        </button>
        <button className="py-2" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default App;
