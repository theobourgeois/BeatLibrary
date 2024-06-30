import * as THREE from "three";

export type Three = {
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
};

type Shape =
    | "cube"
    | "sphere"
    | "prism"
    | "pyramid"
    | "torus"
    | "cone"
    | "cylinder"
    | "dodecahedron"
    | "octahedron"
    | "tetrahedron"
    | "torusknot"
    | "tube"
    | "ring"
    | "plane"
    | "circle"
    | "shape";

type VisualizerNodeFunction<T> = (
    params: T,
    three: Three,
    dataArray: Uint8Array,
    id: number,
    bufferLength: number,
    width: number,
    height: number
) => void;

const waveNode: VisualizerNodeFunction<{
    color?: string;
    amplitude?: number;
    fillUnder?: boolean;
    period?: number;
    startY?: number;
    thickness?: number;
    invert?: boolean;
    invertX?: boolean;
    startZ?: number;
    flip?: boolean;
}> = (
    {
        color = "white",
        amplitude = 1,
        fillUnder = false,
        invertX = false,
        period = 10,
        startY = 0,
        startZ = 0,
        invert = false,
        flip = false,
        thickness = 1,
    },
    three,
    arr,
    id,
    len,
    width,
    height
) => {
    three.camera.position.z = 2;
    const points = [];
    for (let i = 0; i < width; i++) {
        const index = Math.floor((i / width) * len);
        let v = arr[index] / 255.0;
        v *= amplitude;

        let y = (v * height) / 2 / height + startY;
        y = invert ? -y : y;
        let x = ((i / width) * 2 - 1) * period;
        x = invertX ? -x : x;

        if (flip) {
            points.push(new THREE.Vector3(y, x, startZ));
        } else {
            points.push(new THREE.Vector3(x, y, startZ));
        }
    }

    let line = three.scene.children.find(
        (child) => child.name === `wave-${id}`
    ) as THREE.Line;
    if (!line) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: thickness,
        });
        line = new THREE.Line(geometry, material);
        line.name = `wave-${id}`;
        three.scene.add(line);
    } else {
        line.geometry.setFromPoints(points);
    }

    if (fillUnder) {
        const y = invert ? -startY : startY;
        // Clone the points array and add points at the bottom to close the shape
        const closedPoints = points.slice(); // Clone the original points
        // Add a point at the bottom-right corner
        closedPoints.push(
            new THREE.Vector3(points[points.length - 1].x, y, startZ)
        );
        // Add a point at the bottom-left corner to close the shape
        closedPoints.push(new THREE.Vector3(points[0].x, y, startZ));

        // Create a shape from the closed points
        const shape = new THREE.Shape(
            closedPoints.map((p) => new THREE.Vector2(p.x, p.y))
        );
        const fillGeometry = new THREE.ShapeGeometry(shape);
        let fillMesh = three.scene.children.find(
            (child) => child.name === `wave-fill-${id}`
        ) as THREE.Mesh;

        if (!fillMesh) {
            // Use ShapeGeometry for the filled shape
            const fillMaterial = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
            });
            fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
            fillMesh.name = `wave-fill-${id}`;
            three.scene.add(fillMesh);
        } else {
            fillMesh.geometry.dispose();
            fillMesh.geometry = new THREE.ShapeGeometry(shape);
        }
    }
};

const zoomNode: VisualizerNodeFunction<{
    zoomSpeed?: number;
    maxZoom?: number;
    minZoom?: number;
}> = ({ zoomSpeed = 0.1, maxZoom = 10, minZoom = 2 }, three, arr) => {
    three.camera.position.z = 2;
    const average = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    const ratio = (average / 128.0) * 2 - 1;
    three.camera.position.z = ratio * (maxZoom - minZoom) * zoomSpeed + minZoom;
};

const shape3dNode: VisualizerNodeFunction<{
    color?: string;
    amplitude?: number;
    space?: number;
    numOfShapes?: number;
    startY?: number;
    startX?: number;
    startZ?: number;
    maxRotation?: number;
    rotateX?: boolean;
    rotateY?: boolean;
    rotateZ?: boolean;
    size?: number;
    shape?: Shape;
}> = (
    {
        color = "white",
        shape = "cube",
        rotateX = true,
        rotateY = true,
        rotateZ = true,
        space = 0,
        size = 1,
        startY = 0,
        startX = 0,
        startZ = 0,
        amplitude = 0.02,
        numOfShapes = 1,
    },
    three,
    arr,
    id
) => {
    three.camera.position.z = 2;
    const material = new THREE.MeshBasicMaterial({ color: color });
    const average = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    const ratio = (average / 128.0) * 2 - 1;
    const amplifier = amplitude * ratio;

    for (let i = 0; i < numOfShapes; i++) {
        const shapeId = `shape3d-${i}-${id}`;
        let mesh = three.scene.children.find((child) => child.name === shapeId);
        if (!mesh) {
            const shapeSize = (1 / numOfShapes) * size;
            let geometry;
            switch (shape) {
                case "cube":
                    geometry = new THREE.BoxGeometry(
                        shapeSize,
                        shapeSize,
                        shapeSize
                    );
                    break;
                case "sphere":
                    geometry = new THREE.SphereGeometry(shapeSize, 32, 32);
                    break;
                case "prism":
                    geometry = new THREE.CylinderGeometry(
                        shapeSize,
                        shapeSize,
                        shapeSize,
                        3
                    );
                    break;
                case "pyramid":
                    geometry = new THREE.ConeGeometry(shapeSize, shapeSize, 4);
                    break;
                case "torus":
                    geometry = new THREE.TorusGeometry(shapeSize, 0.1, 16, 100);
                    break;
                case "cone":
                    geometry = new THREE.ConeGeometry(shapeSize, shapeSize, 32);
                    break;
                case "cylinder":
                    geometry = new THREE.CylinderGeometry(
                        shapeSize,
                        shapeSize,
                        shapeSize,
                        32
                    );
                    break;
                case "dodecahedron":
                    geometry = new THREE.DodecahedronGeometry(shapeSize);
                    break;
                case "octahedron":
                    geometry = new THREE.OctahedronGeometry(shapeSize);
                    break;
                case "tetrahedron":
                    geometry = new THREE.TetrahedronGeometry(shapeSize);
                    break;
                case "torusknot":
                    geometry = new THREE.TorusKnotGeometry(shapeSize, 0.1);
                    break;
                case "tube":
                    geometry = new THREE.TubeGeometry(
                        new THREE.CatmullRomCurve3([
                            new THREE.Vector3(
                                -shapeSize,
                                -shapeSize,
                                -shapeSize
                            ),
                            new THREE.Vector3(shapeSize, shapeSize, shapeSize),
                        ]),
                        64,
                        0.1,
                        8,
                        false
                    );
                    break;
                default:
                    geometry = new THREE.BoxGeometry(
                        shapeSize,
                        shapeSize,
                        shapeSize
                    );
            }
            mesh = new THREE.Mesh(geometry, material);
            three.scene.add(mesh);
            mesh.name = shapeId;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.position.x = i * space - numOfShapes / 2;
            mesh.position.x += startX;
            mesh.position.y = startY;
            mesh.position.z = startZ;
        }

        // console.log(color, shapeId, mesh.rotation.x, amplifier);
        if (rotateX) {
            mesh.rotation.x += amplifier;
        }
        if (rotateY) {
            mesh.rotation.z += amplifier;
        }
        if (rotateZ) {
            mesh.rotation.y += amplifier;
        }
    }
};

export const visualizerNodeFuncs = {
    wave: waveNode,
    shape3d: shape3dNode,
    zoom: zoomNode,
};
