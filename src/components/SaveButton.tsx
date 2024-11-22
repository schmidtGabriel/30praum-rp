export default function SaveButton(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button
      type="submit"
      onClick={props.onClick}
      className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      Save
    </button>
  );
}
