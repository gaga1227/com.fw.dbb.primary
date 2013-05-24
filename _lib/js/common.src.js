/* ------------------------------------------------------------------------------ */
/* initSelectNav */
/* ------------------------------------------------------------------------------ */
function initSelectNav() {
	
	//check if DOM elem exists
	if ( !$('#nav').length || !$('#navSelect').length ) return false;
	
	//create global obj
	var selectNav = {};
	
	//function - update
	selectNav.update = function() {
		
		//check if $btnSelect is set visible from Media Queries
		this.selectMode = this.$btnSelect.css('display') != 'none';
		
		//enable select nav if selectMode is on
		if ( this.selectMode ) {
			
			//update select label text
			this.$selectedItem = this.$items.filter('.selected:first').find('> a:first');
			if (this.$selectedItem.length) {
				this.$btnSelectLabel.text( this.$selectedItem.text() );
			} else {
				this.$btnSelectLabel.text( this.defaultLabel );
			};
			
		} else {
			
		}
			
	};
	
	//function - bindBtn
	selectNav.bindBtn = function() {
		
		//bind event
		this.$btnSelect.on( 'click', function(e){
			e.preventDefault();
			if ( selectNav.selectMode ) {
				//if nav is active
				if ( !selectNav.$container.hasClass('active') ) {
					selectNav.$container
						.addClass('active');
					selectNav.$icon
						.removeClass( selectNav.iconClass[0] )
						.addClass( selectNav.iconClass[1] );
				} 
				//if nav is not active
				else { 
					selectNav.$container
						.removeClass('active');
					selectNav.$icon
						.removeClass( selectNav.iconClass[1] )
						.addClass( selectNav.iconClass[0] );
				}
				//update
				selectNav.update();
			}
		});
		
	};
	
	//function - init
	selectNav.init = function(){
		
		//cache DOM elems
		this.$container = $('#nav');
		this.$btnSelect = $('#navSelect');
		this.$btnSelectLabel = this.$btnSelect.find('.label');
		this.$items = this.$container.find('#navItems').find('> .navItem');
		this.$selectedItem = null,
		this.$icon = this.$btnSelect.find('.icon');
		
		//cache properties
		this.selectMode = false;
		this.speed = 300;
		this.defaultLabel = 'Menu',
		this.iconClass = [ 'icon-chevron-down', 'icon-chevron-up' ];
		
		//first update
		this.update();
		
		//bind button
		this.bindBtn();
		
		//update on window resize
		$(window).resize(function(e) {
			selectNav.update();
		});
		
	};
	
	//init obj
	selectNav.init();
	
	//return global obj
	return selectNav;
		
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var SelectNav, Slideshows, StaticVideos;
function init(){
	
	//layout assistance
	insertFirstLastChild('.navItems, .navItems ul, #newsListing');
	
	//interactions	
	SelectNav = new initSelectNav();
	Slideshows = initSlideshows();
	
	//template specific functions
	if ( $('body#home').length ) {
		initHome();
	} else {
		StaticVideos = new initStaticVideos();
	}

	//css3pie rendering
	initCSS3PIE();
	
	//debug
	displayDebugInfo('#debugInfo');
	
}
function initHome(){
	
} 
/* DOM.ready */
$(document).ready(function(){ 
	Platform.addDOMClass();
	init();	
});
