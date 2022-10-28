document.addEventListener('DOMContentLoaded', () => {

	gsap.registerPlugin(ScrollTrigger);

	const hero = document.querySelector(".hero");

	// Mobile Menu
	class Expander {
		constructor(options = {}) {
			const {
				openingButton = '.hamburgerButton',
				openingElement = '.navigationMenu',
				closingButton = '.navigationClose',
				togglerClass = 'active',
			} = options;

			this.openingButton = openingButton;
			this.openingElement = openingElement;
			this.closingButton = closingButton;
			this.togglerClass = togglerClass;
			this.init();
		}

		init() {
			const openingButton = document.querySelector(this.openingButton);
			const menu = document.querySelector(this.openingElement);
			const sections = document.querySelectorAll('.section');

			let toggleMenu = () => {
				let expanded = openingButton.getAttribute('aria-expanded');

				(expanded === 'false') ?
						openingButton.setAttribute('aria-expanded', true) :
						openingButton.setAttribute('aria-expanded', false);
				menu.classList.toggle(this.togglerClass);
				openingButton.classList.toggle(this.togglerClass);
				document.body.classList.toggle('no-scroll');

				for (let section of sections) {
					section.classList.toggle(this.togglerClass);
				}
			};

			openingButton.addEventListener('click', toggleMenu);


			document.addEventListener('click', e => {
				if (!e.target.closest(this.openingElement) && !e.target.closest(this.openingButton)) {
					openingButton.setAttribute('aria-expanded', false);
					menu.classList.remove(this.togglerClass);
					openingButton.classList.remove(this.togglerClass);
					document.body.classList.remove('no-scroll');
					for (let section of sections) {
						section.classList.remove(this.togglerClass);
					}
				}
			});

		}
	}

	new Expander();

	// Faq
	$('.faq-item__btn').on('click', function () {
		if (!$(this).hasClass('opened') && $('.faq-item__btn').hasClass('opened')) {
			$('.faq-item__btn').removeClass('opened');
			$('.faq-item__content').slideUp(400, function() {
				ScrollTrigger.refresh();
			});
		}

		$(this).toggleClass('opened');
		$(this).next().slideToggle(400, function() {
			ScrollTrigger.refresh();
		});
	});

	const controllerRoadmap = new ScrollMagic.Controller();

	if ($(window).width() >= 768) {
		const wipeAnimation = new TimelineMax()
				.to(".roadmap__box", 1, {x: `-1350px`});

		new ScrollMagic.Scene({
			triggerElement: ".roadmap",
			triggerHook: "onLeave",
			duration: "200%"
		}).setPin(".roadmap")
				.setTween(wipeAnimation)
				.addTo(controllerRoadmap);
	}

	// Scroll-down
	gsap.to(".scroll-down", {
		y: 150,
		scrollTrigger: {
			trigger: hero,
			start: "top+=350 top",
			once: true
		}
	});

	// Fish video scroll animation
	//--------------------------------
	// Encoding is important!!!
	// ffmpeg settings used:
	//--------------------------------
	// ffmpeg -i input.mp4 -vf scale=2192:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output.mp4

	const fishVideo = hero.querySelector(".hero__fish-video");

	var fishFrameNumber = 0;
	let fishTl = gsap.timeline();

	ScrollTrigger.create({
		animation: fishTl,
		trigger: hero,
		start: "top top",
		end: "bottom+=150% bottom",
		pin: true,
		scrub: 1,
		anticipatePin: 1,
		onUpdate: self => {
			var key = false;
			fishFrameNumber = self.progress / 10 * 22;
			fishVideo.currentTime = fishFrameNumber;
			if ( (self.progress > 0.95) && (key == false)) { // last frame
				hero.classList.add("hero_static");
				// bubbleContainer.classList.add("bubbles_show");
				key = true;
			}
		},
		once: true,
		onLeave: function (self) {
		  let start = self.start;
		  self.scroll(self.start);
		  self.disable();
		  self.animation.progress(1);
		  ScrollTrigger.refresh();
		  window.scrollTo(0, start);
		}
	});

	fishTl.from(fishVideo, {scale: 0.78}, "fish-small__label")
			.to(".fish-1", {x:"-300%", y:"-30%", autoAlpha: 0}, "fish-small__label")
			.to(".fish-2", {x:"-500%", y:"-100%", autoAlpha: 0}, "fish-small__label")
			.to(".fish-3", {x:"-300%", autoAlpha: 0}, "fish-small__label")
			.to(".fish-4", {x:"-200%", y:"50%", autoAlpha: 0}, "fish-small__label")
			.to(".fish-5", {x:"-50%", y:"100%", autoAlpha: 0}, "fish-small__label")
			.to(".fish-6", {x:"300%", y:"-50%", autoAlpha: 0}, "fish-small__label")
			.to(".fish-7", {x:"350%", y:"50%", autoAlpha: 0}, "fish-small__label");

	// fishTl.from(fishVideo, {scale: 0.5});


// let fishTl = gsap.timeline({
//   scrollTrigger: {
//     trigger: "video",
//     start: "top top",
//     end: "bottom+=200% bottom",
//     scrub: true,
//     markers: true
//   }
// });
//
// // wait until video metadata is loaded, so we can grab the proper duration before adding the onscroll animation. Might need to add a _loader.html for loonng videos
// fishVideo.onloadedmetadata = function () {
//   fishTl.to(fishVideo, {currentTime: fishVideo.duration});
// };
//
// // Dealing with devices
// function isTouchDevice() {
//   return (
//     "ontouchstart" in window ||
//     navigator.maxTouchPoints > 0 ||
//     navigator.msMaxTouchPoints > 0
//   );
// }
//
// if (isTouchDevice()) {
//   fishVideo.play();
//   fishVideo.pause();
// }


	// Shark video scroll animation
	const sharkWrap = document.querySelector(".stay__wrap");
	const shark = document.querySelector(".stay__shark img");

	// var sharkFrameNumber = 0;
	let sharkTl = gsap.timeline();

	gsap.to(".bubbles, .bg-light", {
		opacity: 0,
		scrollTrigger: {
			trigger: sharkWrap,
			start: "top bottom-=10%",
			end: "top top",
			scrub: true,
		}
	});

	gsap.to(".stay__bg", {
		opacity: 1,
		scrollTrigger: {
			trigger: sharkWrap,
			start: "top top",
			end: "center top",
			scrub: true,
		}
	});

	ScrollTrigger.create({
		animation: sharkTl,
		trigger: sharkWrap,
		start: "top top",
		end: "bottom+=200% bottom",
		// markers: true,
		pin: true,
		scrub: 1,
		anticipatePin: 1,
		// onUpdate: self => {
		// 	sharkFrameNumber = self.progress / 10 * 32;
		// 	shark.currentTime = sharkFrameNumber;
		// },
	});

	sharkTl.to(shark, {scale: 17, ease: Power2.easeIn})
			.to(shark, {opacity: 0, duration: 0.1}, "-=50%")
			.to(".stay__content", {opacity: 1, duration: 0.1}, "-=170%");

	// Bubbles animation
	const bubbleContainer = document.querySelector(".bubbles");

	function createBubble() {
		let bubble = document.createElement("span");
		bubble.classList.add("bubble");
		let size = Math.random() * 10;
		bubble.style.width = 4 + size + "px";
		bubble.style.height = 4 + size + "px";
		bubble.style.left = Math.random() * innerWidth + "px";
		bubbleContainer.appendChild(bubble);

		setTimeout(() => {
			bubble.remove();
		}, 20000);
	}

	// setInterval(createBubble, 700);

	// Element in viewport - Animations
	const featuredProject = gsap.utils.toArray("[data-animation]");

	featuredProject.forEach((item) => {
		gsap.from(item, {
			scrollTrigger: {
				start: 'top bottom-=300',
				end: 'bottom top',
				trigger: item,
				onEnter() {
					item.classList.add('animate');
				},
			}
		});
	});

});
