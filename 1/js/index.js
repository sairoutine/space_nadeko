/* global $, THREE, dat */
'use strict';

var WIDTH = 600;
var HEIGHT = 480;

var Config = function() {
	this.x = 0;
	this.y = 0;
	this.z = -15;
};
var config = new Config();

window.onload = function() {
	var gui = new dat.GUI();
	gui.add(config, 'x', -50, 50);
	gui.add(config, 'y', -50, 50);
	gui.add(config, 'z', -50, 50);
};




$(function () {
	// 惑星
	var planet = (function() {

		// 球体(radius, widthSegments, heightSegments)
		var planetGeometry = new THREE.SphereGeometry(4,20,20);
		var planetMaterial = (function() {
			// A material for shiny surfaces
			var planetMaterial = new THREE.MeshPhongMaterial();

			var texture = THREE.ImageUtils.loadTexture("./img/planet-512.jpg");
			planetMaterial.map = texture;

			var specmap = THREE.ImageUtils.loadTexture("./img/water-map-512.jpg");
			// affects both how much the specular surface highlight contributes and how much of the environment map affects the surface
			planetMaterial.specularMap = specmap;

			// 窪んでるところが赤く見える
			planetMaterial.specular = new THREE.Color( 0xff0000 );
			planetMaterial.shininess = 1;

			var normalmap = THREE.ImageUtils.loadTexture("./img/normal-map-512.jpg");
			planetMaterial.normalMap = normalmap;
			planetMaterial.normalScale.set(-0.3,-0.3);

			return planetMaterial;
		})();

		var planet = new THREE.Mesh(planetGeometry, planetMaterial);

		//here we allow the texture/normal/specular maps to wrap
		planet.material.map.wrapS = THREE.RepeatWrapping;
		planet.material.map.wrapT = THREE.RepeatWrapping;
		planet.material.normalMap.wrapS = THREE.RepeatWrapping;
		planet.material.normalMap.wrapT = THREE.RepeatWrapping;
		planet.material.specularMap.wrapS = THREE.RepeatWrapping;
		planet.material.specularMap.wrapT = THREE.RepeatWrapping;

		//here we repeat the texture/normal/specular maps twice along X
		planet.material.map.repeat.set( 2, 1);
		planet.material.normalMap.repeat.set( 2, 1);
		planet.material.specularMap.repeat.set( 2, 1);

		planet.position.x = 0;
		planet.position.y = 0;
		planet.position.z = 0;

		return planet;
	})();

	// 宇宙
	var spacesphere = (function() {
		//Space background is a large sphere
		var spacetex = THREE.ImageUtils.loadTexture("./img/space.jpg");
		var spacesphereGeo = new THREE.SphereGeometry(20,20,20);
		var spacesphereMat = new THREE.MeshPhongMaterial();
		spacesphereMat.map = spacetex;

		var spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);

		//spacesphere needs to be double sided as the camera is within the spacesphere
		spacesphere.material.side = THREE.DoubleSide;

		spacesphere.material.map.wrapS = THREE.RepeatWrapping;
		spacesphere.material.map.wrapT = THREE.RepeatWrapping;
		spacesphere.material.map.repeat.set( 5, 3);
		return spacesphere;
	})();

	// 3Dシーン
	var scene = (function(){
		var scene = new THREE.Scene();
		scene.add(planet);
		scene.add(spacesphere);

		//create two spotlights to illuminate the scene
		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( -40, 60, -10 );
		spotLight.intensity = 2;
		scene.add( spotLight );

		var spotLight2 = new THREE.SpotLight( 0x5192e9 );
		spotLight2.position.set( 40, -60, 30 );
		spotLight2.intensity = 1.5;
		scene.add( spotLight2 );

		return scene;
	})();

	// 3D カメラ
	var camera = (function(){
		var camera = new THREE.PerspectiveCamera(45 , WIDTH / HEIGHT , 0.1, 1000);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = -15;
		camera.lookAt(scene.position);

		return camera;
	})();

	// 2Dカメラ
	var camera2d = new THREE.OrthographicCamera(45 , WIDTH / HEIGHT , 0.1, 1000);

	// 2Dシーン
	var scene2d = (function() {
		var scene2d = new THREE.Scene();

		var texture = THREE.ImageUtils.loadTexture("img/ndk.png");
		var material = new THREE.SpriteMaterial({map: texture});
		var sprite;
		var w = texture.image.width, h = texture.image.height;

		sprite = new THREE.Sprite(material);
		sprite.position.set(w * 1, h * 0.5, -9999);
		sprite.scale.set(w / 2, h / 2, 1);
		scene2d.add(sprite);

		return scene2d;
	})();

	// renderer
	var renderer = (function() {
		var renderer = new THREE.WebGLRenderer();

		renderer.setSize(WIDTH, HEIGHT);
		renderer.autoClear = false ;
		return renderer;
	})();

	$("#WebGL-output").append(renderer.domElement);

	render();
	function render() {
		//rotate planet and spacesphere
		planet.rotation.y += 0.002;
		spacesphere.rotation.y += 0.001;
		camera.position.x = config.x;
		camera.position.y = config.y;
		camera.position.z = config.z;

		renderer.render(scene, camera);
		renderer.render(scene2d, camera2d);

		requestAnimationFrame(render);
	}

});
