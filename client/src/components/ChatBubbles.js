export default function ChatBubbles(props) {
  return (
    <>
      <li className={props.typer}>
        <i>
          <small style={{ fontSize: "10px" }}>{props.nameUser}</small>
        </i>
        <br />
        {props.msg}
      </li>
    </>
  );
}
