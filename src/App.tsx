import GitHubSearch from "./components/GitHubSearch";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>GitHub Repository Search</h1>
      <GitHubSearch />
    </div>
  );
}

export default App;
