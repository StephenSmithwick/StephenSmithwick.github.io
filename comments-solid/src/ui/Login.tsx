import { createSignal, Show } from "solid-js";

import { Anonymous, Author } from "../lib/comments/definitions";

function SignOutButton({ user }: { user: Author }) {
  return (
    <button onClick={() => signOut()}>
      <img class="avatar" src={user.image} alt="Author Avatar" /> {user.name}
    </button>
  );
}

function SignInButton() {
  return (
    <button onClick={() => signIn("github", { redirect: false })}>
      <img class="avatar" src={Anonymous.image} alt="Author Avatar" /> Sign in
    </button>
  );
}

export default function Login() {
  const user = {
    ...Anonymous,
  } as Author;
  const [loggedIn, setLoggedIn] = createSignal(false);

  return (
    <Show when={loggedIn()} fallback={<SignInButton />}>
      <SignOutButton user={user} />
    </Show>
  );
}

function signIn(service: string, options: { redirect: boolean }) {
  console.log(`stub signIn(${service}, ${options})`);
}

function signOut() {
  console.log(`stub signOut`);
}
