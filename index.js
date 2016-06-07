AFRAME = AFRAME || window.AFRAME;
AFRAME = AFRAME.aframeCore || AFRAME;

function getPoseMatrix (pose, display) {
	var orientation = new THREE.Quaternion();
	var position = new THREE.Vector3();
	var scale = new THREE.Vector3();
	scale.fromArray([1,1,1]);

	if (!orientation) {
		orientation.fromArray([0, 0, 0, 1]);
	}
	else {
		orientation.fromArray(pose.orientation);
	}
	if (!position) {
		position.fromArray([0, 0, 0]);
	}
	else {
		position.fromArray(pose.position);
	}

	var m = new THREE.Matrix4();
	m.compose(position,orientation,scale)


	var stage = new THREE.Matrix4();
	stage.fromArray(display.stageParameters.sittingToStandingTransform);
	stage.multiply(m);
	return stage;
}

AFRAME.registerComponent('webvr-controller', {
	schema: { type: 'int' },

	update: function(){
		var _this = this;
		navigator.getVRDisplays().then(function(displays) {
			if (displays.length > 0) {
				_this.display = displays[0];			}
		});
	},

	tick: function () {
		var object3D = this.el.object3D;
		if(this.display){
			var vrGamepads = [];

			var gamepads = navigator.getGamepads();

			for (var i = 0; i < gamepads.length; ++i) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.pose) {
					vrGamepads.push(gamepad);
				}
			}

			if(this.display && vrGamepads.length==2){
				var gamepad = vrGamepads[this.attrValue];
				object3D.matrix = getPoseMatrix(gamepad.pose, this.display);
				object3D.matrixAutoUpdate = false;
			}
		}
	}
});