/* ------------------------------------------------------------------------------ */
/* initInfoTip */
/* ------------------------------------------------------------------------------ */
function initInfoTip(spd,buf){
	if (!$('.btnInfoTip').length) return;
	//cache vars
	var infoTip = { count:0 },
		$btns = $('.btnInfoTip'),//get all btnInfoTip
		$infoTip = $('<div class="infoTip"><div class="infoTipContent"></div><div class="ir pngBg imgTip"></div></div>').insertAfter($('#container')),//prepare infoTip obj
		$infoTipContent = $infoTip.find('.infoTipContent'),//infoTip content
		touchOS = Platform.touchOS,//check if touchOS
		speed = spd || 300,//get transition speed or use default
		buffer = buf || 0;//get buffer around infoTip width or use default
		scrollbarW = 20;//scrollbar width window width
	
	//process each btn
	$.each($btns,function(idx,ele){
		//vars
		var $btn = $(ele),
			btnThresholdW = $btn.width()/2;
		//process infoTip data
		$btn.attr('data-title',$btn.attr('title')).removeAttr('title');//move title text to 'data-title'
		$.data(ele,'infoTipText',$btn.attr('data-title'));//store title into data
		$.data(ele,'popupFlag',false);//set popup flag to false
		//determine btn directions
		function updateTipDir() {	
			var viewportW = $(window).width()-scrollbarW,//always factor in the scrollbar width
				tipThresholdW = ($infoTip.width()+buffer)/2; 			
			if ($btn.offset().left <= tipThresholdW ) { return 'left'; }
			else if ((viewportW-$btn.offset().left-btnThresholdW) <= tipThresholdW) { return 'right'; }
			else { return 'center'; }
		}
		//get new position
		function getNewPos() {
			var pos = {};
			if (updateTipDir()=='left') {//if left
				pos.newLeft = $btn.offset().left+btnThresholdW;
				pos.newTop = $btn.offset().top-$infoTip.height();
				pos.newDir = 'infoTipLeftCnr';
				//console.log('left');
			} else if(updateTipDir()=='right') {//if right
				pos.newLeft = $btn.offset().left-$infoTip.width()+btnThresholdW;
				pos.newTop = $btn.offset().top-$infoTip.height();
				pos.newDir = 'infoTipRightCnr';
				//console.log('right');
			} else {//center
				pos.newLeft = $btn.offset().left-$infoTip.width()/2+btnThresholdW;
				pos.newTop = $btn.offset().top-$infoTip.height();
				pos.newDir = '';
				//console.log('center');
			}
			return pos;
		}
		//set new position
		function setNewPos(){
			//set position value
			var pos = getNewPos();
			$infoTip
				.removeClass('infoTipLeftCnr infoTipRightCnr')
				.addClass(pos.newDir)//apply direction class for corner
				.css({ 'left':pos.newLeft, 'top':pos.newTop	})//apply position
				.stop(true, true)//stop all animation
				.fadeIn(speed,function(){//fade in
					//when faded
					$.each($btns,function(i,e){
						if (e!=ele) $.data(e,'popupFlag',false);
					});
					$.data(ele,'popupFlag',true);
				});	
		}
		//onOver
		function onOver(){			
			//touchOS
			if(touchOS && $.data(ele,'popupFlag')){ onOut(); return; }//if tap on same btn
			if(touchOS){ onOut(0); }//if tap on other btn
			//insert new content html
			$infoTipContent.html($.data(ele,'infoTipText'));
			//setNewPos
			setNewPos();
		}
		//onOut
		function onOut(s){
			var spd = s || speed;
			$infoTip.fadeOut(spd,function(){$.data(ele,'popupFlag',false);});//hide
		}
		//bind functions to events depending on device
		if (touchOS) {
			$($btn).bind('click', onOver);
			window.onorientationchange = function(){ onOut(0); };//hide infoTip on orientation change
		} else {
			$($btn).hoverIntent(onOver, onOut).bind('click', function(e){e.preventDefault();});
		}
		
		//update collection obj
		infoTip.count++;
	});
	
	//function - hideInfoTip
	infoTip.hideInfoTip = function() {
		$infoTip.fadeOut(speed,function(){
			$.each($btns,function(idx,ele){
				$.data(ele,'popupFlag',false);
			});
		});
	}
	
	//return collection obj
	return infoTip;
}