import Comments from "./ui/Comments";
import NewComment from "./ui/NewComment";

export default function Home() {
  return (
    <>
      <h2>Comments</h2>
      <NewComment post="test" />
      <Comments post="test" />
    </>
  );
}
