import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

//Camera
const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,5,5);

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 10;
orbitControls.maxDistance = 25;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 -0.05;
orbitControls.update();

const axesHelper = new THREE.AxesHelper(10,10,10 );
axesHelper.setColors(0xeff542,0x75f542, 0xffffff) // Ye, gre, wh
// scene.add( axesHelper );

//Light
light();

// BOARD
generateBoard()

// FUNCTION
function generateBoard() {
    var board, cubeGeo, lightMaterial, blackMaterial;

    lightMaterial = new THREE.MeshPhongMaterial({ color: 0x5c5c5c });
    blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    cubeGeo = new THREE.BoxGeometry(1, 0.3, 1);
    cubeGeo.receiveShadow =true;

    board = new THREE.Group();

    for (let x = 0; x < 8; x++) {
        for (let z = 0; z < 8; z++) {
            var cube;
            if (z % 2 == false) {
                cube = new THREE.Mesh(cubeGeo, x % 2 == false ? lightMaterial : blackMaterial);
            } else {
                cube = new THREE.Mesh(cubeGeo, x % 2 == false ? blackMaterial : lightMaterial);
            }
            cube.position.set(x, 0, z);
            cube.receiveShadow = true;
            orbitControls.target.set(x/2, 0, z/2);
            board.add(cube);
        }
    }

    scene.add(board);
}

function light() {
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xfffffa, 5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

    scene.add(directionalLight);
}

// GLTFLoader
const loader = new GLTFLoader();

//King ; 
let blackKingModel, whiteKingModel;
loader.load('./w_king/scene.gltf', (gltf) => {
    gltf.scene.scale.set(20,20,20); 

    blackKingModel = gltf.scene;
    blackKingModel.castShadow = true; 
    blackKingModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    // Clone the black pawn 
    whiteKingModel = blackKingModel.clone();
    whiteKingModel.traverse((node) => {
        if (node.isMesh) {
            node.material = node.material.clone();
            node.material.color.set(0x000000); 
            node.castShadow = true;
        }
    });

    addKing();
});

// Function: Add King to Board
function addKing(){
    if (!blackKingModel || !whiteKingModel) return;

    // Add white pawns
    for (let x = 0; x < 8; x++) {
        if(x === 3){
            const king = blackKingModel.clone();
            king.position.set(x, 0.90, 7);
            king.castShadow = true;
            scene.add(king);
        }
    }

    // Add black kings
    for (let x = 0; x < 8; x++) {
        if(x === 4){
            const king = whiteKingModel.clone();
            king.position.set(x, 0.90, 0);
            scene.add(king);
        }
    }
}

//Queen ; 
let blackQueenModel, whiteQueenModel;
loader.load('./b_queen/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.4, 0.4, 0.4); 

    blackQueenModel = gltf.scene;
    blackQueenModel.castShadow = true; 
    blackQueenModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    // Clone the black pawn 
    whiteQueenModel = blackQueenModel.clone();
    whiteQueenModel.traverse((node) => {
        if (node.isMesh) {
            node.material = node.material.clone();
            node.material.color.set(0xb1b3af);
            node.castShadow = true;
        }
    });

    addQueen();
});

// Function: Add Queen to Board
function addQueen(){
    if (!blackQueenModel || !whiteQueenModel) return;

    // Add white Queen
    for (let x = 0; x < 8; x++) {
        if(x === 3){
            const queen = blackQueenModel.clone();
            queen.position.set(x, 0.90, 0);
            scene.add(queen);
        }
    }

    // Add black Queen
    for (let x = 0; x < 8; x++) {
        if(x === 4){
            const queen = whiteQueenModel.clone();
            queen.position.set(x, 0.90, 7);
            scene.add(queen);
        }
    }
}

//Knights ; 
let blackKnightModel, whiteKnightModel;
loader.load('./ww_knight.glb', (gltf) => {
// loader.load('./w_knight/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.023, 0.023, 0.023); 
    // gltf.scene.position.set(0, 0, 0)
    
    blackKnightModel = gltf.scene;
    blackKnightModel.rotation.set(0, 1.5, 0)
    blackKnightModel.castShadow = true; 
    blackKnightModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });
    blackKnightModel.position.setX(4);
    blackKnightModel.position.setY(2)
    
    // Clone the black knight 
    whiteKnightModel = blackKnightModel.clone();
    whiteKnightModel.rotation.set(0, -1.5, 0)
    whiteKnightModel.traverse((node) => {
        if (node.isMesh) {
            node.material = node.material.clone();
            node.material.color.set(0x000000);
            node.castShadow = true;
        }
    });

    addKnight();
});

// Function: Add Knight to Board
function addKnight(){
    if (!blackKnightModel || !whiteKnightModel) return;

    // Add white knights
    for (let x = 0; x < 8; x++) {
        if (x === 1 || x === 6) {
            const knight = blackKnightModel.clone();
            knight.position.set(x, 0.20, 7);
            knight.castShadow = true;
            scene.add(knight);
        }
    }

    // Add black knights
    for (let x = 0; x < 8; x++) {
        if (x === 1 || x === 6) {
            const knight = whiteKnightModel.clone();
            knight.position.set(x, 0.20, 0);
            knight.castShadow = true;
            scene.add(knight);
        }
    }
}

//Bishops ; 
let blackBishopModel, whiteBishopModel;
loader.load('./b_bishop/scene.gltf', (gltf) => {
    blackBishopModel = gltf.scene;
    blackBishopModel.castShadow = true; 
    blackBishopModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    // Clone the black bishop 
    whiteBishopModel = blackBishopModel.clone();
    whiteBishopModel.traverse((node) => {
        if (node.isMesh) {
            node.material = node.material.clone();
            node.material.color.set(0x000000);
            node.castShadow = true;
        }
    });

    addBishop();
});

// Function: Add Bishop to Board
function addBishop(){
    if (!blackBishopModel || !whiteBishopModel) return;

    for (let x = 0; x < 8; x++) {
        if (x === 2 || x === 5) {
            const bishop = blackBishopModel.clone();
            bishop.position.set(x+5, 0.15, 3.80);
            bishop.castShadow = true;
            scene.add(bishop);
        }
    }

    for (let x = 0; x < 8; x++) {
        if(x === 1){
            const bishop = whiteBishopModel.clone();
            bishop.position.set(x+6, 0.15, -3.22);
            bishop.castShadow = true;
            scene.add(bishop);
        }else if(x === 4){
            const bishop = whiteBishopModel.clone();
            bishop.castShadow = true;
            bishop.position.set(x+6, 0.15, -3.22);
            scene.add(bishop);
        }
    }
}

//Rook ; 
let blackRookModel, whiteRookModel;
loader.load('./b_rook/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.45, 0.45, 0.45); 

    blackRookModel = gltf.scene;
    blackRookModel.castShadow = true; 
    blackRookModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    // Clone the black rook 
    whiteRookModel = blackRookModel.clone();
    whiteRookModel.traverse((node) => {
        if (node.isMesh) {
            node.material = node.material.clone();
            node.material.color.set(0xffffff);
            node.castShadow = true;
        }
    });

    addRook();
});

// Function: Add Rook to Board
function addRook(){
    if (!blackRookModel || !whiteRookModel) return;

    // Add white rooks
    for (let x = 0; x < 8; x++) {
        if (x === 0 || x === 7) {
            const rook = whiteRookModel.clone();
            rook.position.set(x-4, -0.96, 6.80);
            rook.castShadow = true;
            scene.add(rook);
        }
    }

    // Add black rooks
    for (let x = 0; x < 8; x++) {
        if (x === 0 || x === 7) {
            const rook = blackRookModel.clone();
            rook.position.set(x-4, -0.96, -0.20);
            rook.castShadow = true;
            scene.add(rook);
        }
    }
}


//Pawn ; 
let blackPawnModel, whitePawnModel;

loader.load('chess_pawn.glb', (gltf) => {
    gltf.scene.scale.set(0.7, 0.7, 0.7); 
    blackPawnModel = gltf.scene;
    blackPawnModel.castShadow = true;
    blackPawnModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    // Clone the whitePawnModel
    whitePawnModel = blackPawnModel.clone();
    whitePawnModel.traverse((node) => {
        if (node.isMesh) {
            node.material = node.material.clone();
            node.material.color.set(0xffffff);
            node.castShadow = true; 
        }
    });

    addPawns();
});

// FUNCTION: Add Pawns to Board
function addPawns() {
    if (!blackPawnModel || !whitePawnModel) return;

    // Add black pawns
    for (let x = 0; x < 8; x++) {
        const pawn = blackPawnModel.clone();
        pawn.position.set(x, 0.15, 1);
        pawn.castShadow = true;
        scene.add(pawn);
    }

    // Add white pawns
    for (let x = 0; x < 8; x++) {
        const pawn = whitePawnModel.clone();
        pawn.position.set(x, 0.15, 6);
        pawn.castShadow = true;
        scene.add(pawn);
    }
}

//Animate
function animate(){
    orbitControls.update();
    renderer.render(scene,camera);
    requestAnimationFrame(animate);

    windowResize();
}
animate();

function windowResize(){
    camera.aspect =innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight)
}
