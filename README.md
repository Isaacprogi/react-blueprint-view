# React Blueprint View

> _A lightweight visual wireframe/blueprint view for React apps._

**React Blueprint View** helps you instantly visualize the DOM structure of your React application — transforming your UI into a clean blueprint-style view for design inspection and debugging.

![React Blueprint View Screenshot](https://raw.githubusercontent.com/isaacprogi/react-blueprint-view/main/public/rb-screenshot.png)


### Installation

```bash

npm install react-blueprint-view



yarn add react-blueprint-view


pnpm add react-blueprint-view

```

## Usage


```tsx
import { BlueprintProvider } from "react-blueprint-view";

export default function App() {
  return (
    <BlueprintProvider showToggle={true}>
      <YourApp />
    </BlueprintProvider>
  );
}
```

Toggle Button is visible by default.
You can hide or show it using the **showToggle** prop.

You can also control the toggle using the **useBlueprint** hook:


```tsx
import { BlueprintProvider, useBlueprint } from "react-blueprint-view";

function CustomToggle() {
  const { enabled, toggle } = useBlueprint();
  return <button onClick={toggle}>{enabled ? "ON" : "OFF"}</button>;
}

```


<!-- ## Ignoring Elements

```jsx
<div data-rbv-ignore>
  This element will not be affected by the blueprint overlay.
</div>

``` -->

 “Image and video elements are excluded, meaning their content will remain visible while the blueprint is active.”


## Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. 🍴 Fork it
2. 🌟 Star it (pretty please?)
3. 🔧 Fix it
4. 📤 PR it
5. 🎉 Celebrate!

Please ensure your code follows the existing style and includes clear commit messages.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Credits

“Built by Isaac Anasonye to analyze layouts and simplify debugging of messy designs.”

---

<div align="center">

**Debugged a layout with React Blueprint?**

[⭐ Star on GitHub](https://github.com/Isaacprogi/react-blueprint-view) |
[📢 Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20ReactBlueprintView!) |
[💬 Join the Discussion](https://github.com/Isaacprogi/react-blueprint-view/discussions) |
[🔗 Connect on LinkedIn](https://www.linkedin.com/in/isaacanasonye)

</div>
