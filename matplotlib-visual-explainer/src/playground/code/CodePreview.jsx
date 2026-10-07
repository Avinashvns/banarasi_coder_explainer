function CodePreview({ data, style }) {
  return (
    <div className="code-preview">
      <div className="code-header">Python Code</div>
      <pre>{`import matplotlib.pyplot as plt

x = ${JSON.stringify(data.x)}
y = ${JSON.stringify(data.y)}

plt.plot(x, y, linewidth=${style.lineWidth})

plt.title("${style.title}")
plt.xlabel("${style.xlabel}")
plt.ylabel("${style.ylabel}")

plt.show()`}</pre>
    </div>
  );
}

export default CodePreview;
