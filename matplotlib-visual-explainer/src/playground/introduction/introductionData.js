export const INTRODUCTION_SECTIONS = {
  matplotlib: {
    title: "What is Matplotlib?",
    description:
      "Matplotlib is a Python library used to create static, animated, and interactive visualizations.",
    points: [
      "Create graphs and charts with Python",
      "Visualize data clearly",
      "Customize colors, styles, labels, and axes",
      "Build the foundation for data visualization",
    ],
  },

  why: {
    title: "Why Matplotlib?",
    description:
      "Matplotlib gives you detailed control over how your data is presented visually.",
    points: [
      "Simple plotting workflow",
      "Highly customizable",
      "Works naturally with NumPy and Pandas",
      "Useful for data analysis and machine learning",
    ],
  },

  pyplot: {
    title: "pyplot",
    description:
      "pyplot is Matplotlib's simple plotting interface. It provides functions such as plot(), title(), xlabel(), ylabel(), and show().",
    points: [
      "matplotlib.pyplot",
      "plt.plot()",
      "plt.title()",
      "plt.xlabel() and plt.ylabel()",
      "plt.show()",
    ],
  },

  import: {
    title: "Importing Matplotlib",
    description:
      "The common way to use Matplotlib's pyplot interface is to import it with the alias plt.",
    points: [
      "Import pyplot",
      "Use the plt alias",
      "Create plots using plt functions",
      "Build the basic Matplotlib workflow",
    ],
  },

  figure: {
    title: "Figure",
    description:
      "A Figure is the overall container that holds one or more plotting areas.",
    points: [
      "Top-level Matplotlib container",
      "Can contain one or more Axes",
      "Controls the overall canvas",
      "Can be saved as an image",
    ],
  },

  axes: {
    title: "Axes",
    description:
      "An Axes is the actual plotting area where data, axes, labels, and other plot elements are drawn.",
    points: [
      "Contains the actual plot",
      "Has X and Y axes",
      "Can contain labels and grid",
      "Multiple Axes can exist inside one Figure",
    ],
  },

  axis: {
    title: "Axis",
    description:
      "An Axis represents the coordinate direction of a plot, such as the X-axis or Y-axis.",
    points: [
      "X-axis represents horizontal values",
      "Y-axis represents vertical values",
      "Contains ticks and tick labels",
      "Defines the coordinate system",
    ],
  },

  plot: {
    title: "Plot",
    description:
      "A plot is the visual representation of data inside an Axes.",
    points: [
      "Data is mapped to coordinates",
      "Points can be connected with lines",
      "Markers can represent individual values",
      "Styles can be customized",
    ],
  },

  xaxis: {
    title: "X-axis",
    description:
      "The X-axis represents the horizontal dimension of the graph.",
    points: [
      "Horizontal direction",
      "Usually represents input or independent values",
      "Contains X ticks",
      "Can be labeled and styled",
    ],
  },

  yaxis: {
    title: "Y-axis",
    description:
      "The Y-axis represents the vertical dimension of the graph.",
    points: [
      "Vertical direction",
      "Usually represents output or dependent values",
      "Contains Y ticks",
      "Can be labeled and styled",
    ],
  },

  plotarea: {
    title: "Plot Area",
    description:
      "The plot area is the region inside the Axes where the actual data visualization appears.",
    points: [
      "Contains the plotted data",
      "Bounded by the coordinate system",
      "Can contain grid lines",
      "Can contain multiple visual elements",
    ],
  },

  
};

export const INTRODUCTION_CONTROLS = [
  {
    title: "MATPLOTLIB",
    items: [
      { label: "What is Matplotlib?", key: "matplotlib" },
      { label: "Why Matplotlib?", key: "why" },
      { label: "pyplot", key: "pyplot" },
      { label: "Import", key: "import" },
    ],
  },

  {
    title: "CORE CONCEPTS",
    items: [
      { label: "Figure", key: "figure" },
      { label: "Axes", key: "axes" },
      { label: "Axis", key: "axis" },
      { label: "Plot", key: "plot" },
    ],
  },

  {
    title: "FIRST LOOK",
    items: [
      { label: "X-axis", key: "xaxis" },
      { label: "Y-axis", key: "yaxis" },
      { label: "Plot Area", key: "plotarea" },
    ],
  },
];