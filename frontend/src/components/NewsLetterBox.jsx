import React, { useState } from "react";

const NewsLetterBox = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="my-20 px-6 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">
          Unlock 20% Off | Subscribe Today!
        </p>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
          Don't miss out — unlock your savings and stay updated with our
          latest collections and exclusive offers.
        </p>

        {subscribed ? (
          <div className="mx-auto my-7 max-w-xl rounded-xl border border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-sm font-medium text-gray-900">
              You're subscribed!
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Thanks for joining Trendify. Your exclusive offer is on the way.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmitHandler}
            className="mx-auto my-7 flex w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-sm focus-within:border-gray-400"
          >
            <input
              className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />

            <button
              type="submit"
              className="shrink-0 rounded-lg bg-black px-6 py-3 text-xs font-medium text-white transition hover:bg-gray-800 sm:px-8"
            >
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsLetterBox;