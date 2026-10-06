import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import "../styles/array-3d.css";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

function formatValue(value) {
  if (typeof value !== "number") return String(value);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function createValueSprite(value) {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 72;

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "800 50px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#1f3b73";
  context.fillText(formatValue(value), canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.78, 0.30, 1);
  return sprite;
}

function flattenNumericValues(array) {
  const values = [];

  const walk = (value) => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      values.push(value);
    }
  };

  walk(array);
  return values;
}

function getCellColor() {
  // Match the light blue glass cell language used by the 2D playground.
  return 0xeaf2ff;
}

function disposeObject(object) {
  if (object.geometry) object.geometry.dispose();

  if (object.material) {
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    materials.forEach((material) => {
      if (material.map) material.map.dispose();
      material.dispose();
    });
  }
}

function Array3DViewer({ array, onCellClick }) {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const onCellClickRef = useRef(onCellClick);
  const selectedKeyRef = useRef(null);
  const directionRef = useRef("row");
  const draggingRef = useRef(false);
  const pointerDownRef = useRef({ x: 0, y: 0 });

  const [selectedKey, setSelectedKey] = useState(null);
  const [direction, setDirection] = useState("row");

  useEffect(() => {
    onCellClickRef.current = onCellClick;
  }, [onCellClick]);

  useEffect(() => {
    selectedKeyRef.current = selectedKey;
  }, [selectedKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const depth = array.length;
    const rows = array[0]?.length ?? 0;
    const columns = array[0]?.[0]?.length ?? 0;

    if (!depth || !rows || !columns) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f9ff);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(5.9, 4.9, 7.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.screenSpacePanning = true;
    controls.minDistance = 3.2;
    controls.maxDistance = 18;
    controls.rotateSpeed = 0.78;
    controls.zoomSpeed = 0.9;
    controls.panSpeed = 0.8;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcbd8ff, 1.1);
    fillLight.position.set(-5, 2, -4);
    scene.add(fillLight);

    const arrayGroup = new THREE.Group();
    scene.add(arrayGroup);

    const guideGroup = new THREE.Group();
    scene.add(guideGroup);

    // Cells deliberately stay close to the 2D playground look.
    const cellWidth = 1;
    const cellHeight = 1;
    const layerThickness = 1;
    const columnGap = 0.20;
    const rowGap = 0.20;
    const depthGap = 0.5;

    const xStep = cellWidth + columnGap;
    const yStep = cellHeight + rowGap;
    const zStep = layerThickness + depthGap;

    const totalWidth = (columns - 1) * xStep;
    const totalHeight = (rows - 1) * yStep;
    const totalDepth = (depth - 1) * zStep;

    for (let d = 0; d < depth; d += 1) {
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < columns; c += 1) {
          const value = array[d][r][c];
          const key = `${d}-${r}-${c}`;

          const geometry = new RoundedBoxGeometry(
            cellWidth,
            cellHeight,
            layerThickness,
            5,
            0.08
          );

          const material = new THREE.MeshPhysicalMaterial({
            color: 0xf7f8ff,
            emissive: 0xe9edff,
            emissiveIntensity: 0.08,
            roughness: 0.34,
            metalness: 0.02,
            clearcoat: 0.35,
            clearcoatRoughness: 0.22,
            transparent: true,
            opacity: 0.98,
          });

          const cell = new THREE.Mesh(geometry, material);
          cell.position.set(
            c * xStep - totalWidth / 2,
            totalHeight / 2 - r * yStep,
            totalDepth / 2 - d * zStep
          );
          cell.userData = { key, depth: d, row: r, col: c, value };

          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({
              color: 0x9bb7f2,
              transparent: true,
              opacity: 0.58,
            })
          );
          cell.add(edges);

          const frontSprite = createValueSprite(value);
          frontSprite.position.set(
            0,
            0,
            layerThickness / 2 + 0.035
          );
          cell.add(frontSprite);

          const backSprite = createValueSprite(value);
          backSprite.position.set(
            0,
            0,
            -(layerThickness / 2 + 0.035)
          );
          cell.add(backSprite);

          arrayGroup.add(cell);
        }
      }
    }

    function makeGuideLine(start, end, color) {
      const startVector = new THREE.Vector3(...start);
      const endVector = new THREE.Vector3(...end);
      const direction = new THREE.Vector3().subVectors(endVector, startVector);
      const length = direction.length();
      const midpoint = new THREE.Vector3().addVectors(startVector, endVector).multiplyScalar(0.5);

      const geometry = new THREE.CylinderGeometry(0.065, 0.065, length, 12);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
      });

      const line = new THREE.Mesh(geometry, material);
      line.position.copy(midpoint);
      line.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );

      return line;
    }

    const baseX = -totalWidth / 2 - 0.55;
    const baseY = -totalHeight / 2 - 0.55;
    const baseZ = totalDepth / 2 + 0.20;
    const axisLength = Math.max(totalWidth, totalHeight, 1.2) * 0.45 + 0.9;

    const axisY = makeGuideLine(
      [baseX, baseY, baseZ],
      [baseX, baseY + axisLength, baseZ],
      0x6f4cf5
    );
    const axisX = makeGuideLine(
      [baseX, baseY, baseZ],
      [baseX + axisLength, baseY, baseZ],
      0x2e82f5
    );
    const axisZ = makeGuideLine(
      [baseX, baseY, baseZ],
      [baseX, baseY, baseZ - axisLength],
      0xf08b43
    );

    const axisMaterials = {
      row: axisY.material,
      column: axisX.material,
      depth: axisZ.material,
    };

    guideGroup.add(axisY, axisX, axisZ);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event) => {
      pointerDownRef.current = { x: event.clientX, y: event.clientY };
      draggingRef.current = false;
    };

    const handlePointerMove = (event) => {
      const dx = event.clientX - pointerDownRef.current.x;
      const dy = event.clientY - pointerDownRef.current.y;

      if (Math.hypot(dx, dy) > 6) {
        draggingRef.current = true;
      }
    };

    const handleClick = (event) => {
      if (draggingRef.current) return;

      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(
        arrayGroup.children,
        false
      );
      const hit = intersections.find(
        (item) => item.object?.userData?.key
      );

      if (!hit) return;

      const {
        key,
        depth: selectedDepth,
        row,
        col,
        value,
      } = hit.object.userData;

      selectedKeyRef.current = key;
      setSelectedKey(key);

      onCellClickRef.current?.({
        depth: selectedDepth,
        row,
        col,
        value,
      });
    };

    const handleDoubleClick = () => {
      controls.reset();
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("click", handleClick);
    renderer.domElement.addEventListener("dblclick", handleDoubleClick);
    renderer.domElement.addEventListener("contextmenu", handleContextMenu);

    let animationFrame;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      const activeKey = selectedKeyRef.current;

      arrayGroup.children.forEach((cell) => {
        const active = cell.userData.key === activeKey;
        if (active) {
          cell.material.color.setHex(0x7040f4);
          cell.material.emissive.setHex(0x7d48ff);
          cell.material.emissiveIntensity = 0.34;
          cell.material.roughness = 0.28;
        } else {
          cell.material.color.setHex(0xf7f8ff);
          cell.material.emissive.setHex(0xe9edff);
          cell.material.emissiveIntensity = 0.08;
          cell.material.roughness = 0.34;
        }
      });

      const activeDirection = directionRef.current;
      Object.entries(axisMaterials).forEach(([name, material]) => {
        const active = name === activeDirection;
        material.opacity = active ? 1 : 0.34;
      });

      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      renderer.domElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("dblclick", handleDoubleClick);
      renderer.domElement.removeEventListener(
        "contextmenu",
        handleContextMenu
      );

      controls.dispose();
      controlsRef.current = null;

      arrayGroup.traverse(disposeObject);
      guideGroup.traverse(disposeObject);
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [array]);

  const handleDirectionClick = (nextDirection) => {
    directionRef.current = nextDirection;
    setDirection(nextDirection);
  };

  return (
    <div className="array-3d-card">
      <div className="array-3d-toolbar">
        <div>
          <div className="array-3d-title">3D ARRAY</div>
          <div className="array-3d-shape">
            SHAPE ({array.length}, {array[0]?.length ?? 0}, {array[0]?.[0]?.length ?? 0})
          </div>
        </div>

        <div className="array-3d-direction-controls" aria-label="3D directions">
          <button
            type="button"
            className={`array-3d-direction-button ${direction === "row" ? "active row" : ""}`}
            onClick={() => handleDirectionClick("row")}
          >
            ROW
          </button>
          <button
            type="button"
            className={`array-3d-direction-button ${direction === "column" ? "active column" : ""}`}
            onClick={() => handleDirectionClick("column")}
          >
            COLUMN
          </button>
          <button
            type="button"
            className={`array-3d-direction-button ${direction === "depth" ? "active depth" : ""}`}
            onClick={() => handleDirectionClick("depth")}
          >
            DEPTH
          </button>
        </div>
      </div>



      <div ref={containerRef} className="array-3d-canvas" />

      <div className="array-3d-legend">
        <span><b>AXIS 0</b> → DEPTH / BLOCKS</span>
        <span><b>AXIS 1</b> → ROWS</span>
        <span><b>AXIS 2</b> → COLUMNS</span>
      </div>
    </div>
  );
}

export default Array3DViewer;
