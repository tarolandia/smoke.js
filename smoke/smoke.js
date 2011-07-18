var smoketimeout = [];
var smoke = {

  newdialog: function( ){
		var randId = new Date().getTime();
    this.bodyload( randId );
    return randId;
  },
	bodyload: function( id ){
			var ff = document.createElement('div');
					ff.setAttribute('id', 'smoke-out-' + id );
					ff.setAttribute('class','smoke-base');
					document.body.appendChild(ff);
	},
	
	forceload: function(){
  	smoke.bodyload();
	},

  dummy: function(){
  
  },

	build: function(e,f, randId){
		e = e.replace(/\n/g,'<br />');
		e = e.replace(/\r/g,'<br />');
		var prompt = '';

		if (f.type == 'prompt'){
			prompt = 
				'<div class="dialog-prompt">'+
						'<input id="dialog-input-'+ randId +'" type="text" />'+
					'</div>';
		}
		
		var buttons = '';
		if (f.type != 'signal'){
			buttons = '<div class="dialog-buttons">';
			if (f.type == 'alert'){
				buttons +=
					'<button id="alert-ok-'+ randId +'">OK</button>';
			}
			
			if (f.type == 'prompt' || f.type == 'confirm'){
				buttons +=
					'<button id="'+f.type+'-cancel-'+ randId +'" class="cancel">Cancel</button>'+
					'<button id="'+f.type+'-ok-'+ randId +'">OK</button>';
			}
			
			buttons += '</div>';
		}

		var box =
		  '<div class="smoke-bg" id="smoke-bg-'+ randId +'" ></div>'+
      '<div class="dialog smoke">'+
        '<div class="dialog-inner">'+
            e+
            prompt+
            buttons+			
        '</div>'+
			'</div>';

	
		var ff = document.getElementById('smoke-out-' + randId );
				ff.innerHTML = box;
				ff.className = 'smoke-base smoke-visible';
    
    
		// clear the timeout if it's already been activated
		if (smoketimeout[randId]){
				clearTimeout(smoketimeout[randId]);
		}
		
		// close on background click
		var g = document.getElementById('smoke-bg-' + randId);
				g.addEventListener("click",function(){
					smoke.destroy(f.type, randId);
					if (f.type == 'prompt' || f.type == 'confirm'){
						f.callback(false);
					}
				}, false);





		// listeners for button actions

		if (f.type == 'alert'){
			// return true
			var h = document.getElementById('alert-ok-' + randId);
					h.addEventListener("click",function(){
						smoke.destroy(f.type, randId);
					}, false);

			// listen for enter key or space, close it
			document.onkeyup = function(e){
				if (e.keyCode == 13 || e.keyCode == 32){
					smoke.destroy(f.type, randId);
				}
			};
		}
		
		if (f.type == 'confirm'){
			// return false
			var h = document.getElementById('confirm-cancel-' + randId);
					h.addEventListener("click",function(){
								smoke.destroy(f.type, randId);
								f.callback(false);
					}, false);
			
			
			// return true
			var i = document.getElementById('confirm-ok-' + randId);
					i.addEventListener("click",function(){
								smoke.destroy(f.type, randId);
								f.callback(true);
					}, false);
					
			// listen for enter key or space, close it & return true
			document.onkeyup = function(e){
				if (e.keyCode == 13 || e.keyCode == 32){
					smoke.destroy(f.type, randId);
					f.callback(true);
				}
			};

		}
		
		if (f.type == 'prompt'){
			// focus on input
			var pi = document.getElementById('dialog-input-' + randId);
				
				setTimeout(function(){
					pi.focus();
					pi.select();
				},100);

			// return false
			var h = document.getElementById('prompt-cancel-' + randId);
					h.addEventListener("click",function(){
								smoke.destroy(f.type, randId);
								f.callback(false);
					}, false);

			// return	contents of input box
			var j = document.getElementById('dialog-input-' + randId);
			var i = document.getElementById('prompt-ok-' + randId);
					i.addEventListener("click",function(){
								smoke.destroy(f.type, randId);
								f.callback(j.value);
					}, false);
					
			// listen for enter
			document.onkeyup = function(e){
				if (e.keyCode == 13){
					smoke.destroy(f.type, randId);
					f.callback(j.value);
				}
			};
		}



		// close after f.timeout ms
		if (f.type == 'signal'){
			smoketimeout[randId] = setTimeout(function(){
				smoke.destroy(f.type, randId);
			},f.timeout);
		}
		
	},
	
	destroy: function(type, id, remove){				
		var box = document.getElementById('smoke-out-' + id);
				box.setAttribute('class','smoke-base');

			
			// confirm/alert/prompt remove click listener
			if (g = document.getElementById(type+'-ok-' + id)){
				g.removeEventListener("click", function(){}, false);
				
				// remove keyup listener
				document.onkeyup = null;
			}
			
			// confirm/prompt remove click listener
			if (h = document.getElementById(type+'-cancel-' + id)){

				h.removeEventListener("click", function(){}, false);
			}
			if( remove !== undefined )
  			document.body.removeChild( box );
	},

	alert: function(e){
	  var id = this.newdialog();
	  setTimeout(function(){
  	    smoke.build(e,{type:'alert'},id);
  	  }, 50); 
	},
	
	signal: function(e,f){
		if (typeof(f) == 'undefined'){
			f = 5000;
		}
	  var id = this.newdialog();
	  setTimeout(function(){
		    smoke.build(e,{type:'signal',timeout:f}, id);
  	  }, 50); 
	},
	
	confirm: function(e,f){
	  var id = this.newdialog();
	  setTimeout(function(){
		    smoke.build(e,{type:'confirm',callback:f}, id);
  	  }, 50); 
		
	},
	
	prompt: function(e,f){
	  var id = this.newdialog();
	  setTimeout(function(){
		    return smoke.build(e,{type:'prompt',callback:f}, id);
  	  }, 50); 
	}
	
};



// future

	// maybe ie (8-) support (event handlers, cat monocles)

	// custom prefs
		// custom true/false button text options

