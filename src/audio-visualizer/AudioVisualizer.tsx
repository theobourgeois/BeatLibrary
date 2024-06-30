import { useEffect, useMemo, useRef } from "react";
import { Three, visualizerNodeFuncs } from "./visualizer-nodes";
import * as THREE from "three";
import { Property } from "csstype";
import { getNewID } from "../utils/id";

type AudioVisualizerNodeFunctionName = keyof typeof visualizerNodeFuncs;
type AudioVisualizerNodeParams<T> = T extends AudioVisualizerNodeFunctionName
    ? Parameters<(typeof visualizerNodeFuncs)[T]>[0]
    : never;

export type AudioVisualizerConfig = {
    backgroundColor?: Property.BackgroundColor;
    nodes: Array<{
        params: AudioVisualizerNodeParams<AudioVisualizerNodeFunctionName>;
        type: AudioVisualizerNodeFunctionName;
    }>;
};

type AudioVisualizerProps = {
    volume?: number;
    src: string;
    isPlaying: boolean;
    config: AudioVisualizerConfig;
    onNextTrack: () => void;
    progress?: number; // between 0 and 1
};

function setupAudioContext() {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.connect(audioContext.destination);

    return {
        audioContext,
        analyser,
        bufferLength,
        dataArray,
    };
}

const { audioContext, analyser, bufferLength, dataArray } = setupAudioContext();

export function AudioVisualizer({
    src,
    isPlaying,
    config,
    onNextTrack,
    volume = 0.5,
    progress = 0,
}: AudioVisualizerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const threeRef = useRef<Three | null>(null);
    const audio = useMemo(() => new Audio(src), [src]);
    const isDrawing = useRef(false);
    const configRef = useRef(config);
    const configIds = useRef(config.nodes.map(() => getNewID()));

    useEffect(() => {
        const container = containerRef.current!;
        if (!container) return; // Guard clause if container is not yet available

        // Initialize scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            container.offsetWidth / container.offsetHeight,
            1,
            500
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);
        camera.position.z = 5;

        // allow shadows and lighting in the scene
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Update threeRef with the new objects
        threeRef.current = { camera, scene, renderer };
    }, []);

    useEffect(() => {
        audio.volume = volume;
    }, [volume, audio]);

    useEffect(() => {
        if (!isNaN(audio.duration)) {
            audio.currentTime = audio.duration * progress;
        }
    }, [progress, audio]);

    useEffect(() => {
        configRef.current = config;
        configIds.current = config.nodes.map(() => getNewID());
        // clear the scene and dispose of the objects

        const { scene, renderer } = threeRef.current!;
        scene.children = [];
        renderer.dispose();
    }, [config]);

    useEffect(() => {
        if (threeRef.current) {
            threeRef.current.scene.background = new THREE.Color(
                config.backgroundColor || "black"
            );
        }
    }, [config.backgroundColor]);

    useEffect(() => {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        if (isPlaying) {
            audio.play();
            if (!isDrawing.current) {
                draw();
                isDrawing.current = true;
            }
        } else {
            audio.pause();
            draw();
        }
    }, [audio, isPlaying]);

    useEffect(() => {
        const track = audioContext.createMediaElementSource(audio);
        track.connect(analyser);

        const handleEnded = () => {
            onNextTrack();
            audio.pause();
        };

        track.addEventListener("ended", handleEnded);

        return () => {
            track.removeEventListener("ended", handleEnded);
            track.disconnect();
        };
    }, [audio]);

    useEffect(() => {
        const handleResize = () => {
            const { renderer } = threeRef.current!;
            const container = containerRef.current!;
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const draw = () => {
        const { scene, camera, renderer } = threeRef.current!;
        analyser.getByteFrequencyData(dataArray);
        const container = containerRef.current!;

        // draw each node
        for (let i = 0; i < configRef.current.nodes.length; i++) {
            const node = configRef.current.nodes[i];
            const id = configIds.current[i];
            const nodeFunction = visualizerNodeFuncs[node.type];
            nodeFunction(
                node.params,
                { scene, camera, renderer },
                dataArray,
                id,
                bufferLength,
                container.offsetWidth,
                container.offsetHeight
            );
        }

        renderer.render(scene, camera);

        if (!audio.paused) {
            requestAnimationFrame(draw);
        } else {
            isDrawing.current = false;
        }
    };

    return <div className="w-full h-full" ref={containerRef}></div>;
}
