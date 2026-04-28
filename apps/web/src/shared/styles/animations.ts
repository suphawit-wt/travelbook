// Copyright (c) 2026 Suphawit Watthanataetakun
// Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// See LICENSE or https://creativecommons.org/licenses/by-nc-nd/4.0/ for details.

import { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeInAndPopup = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -42%) scale(0.82);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const slideUp = keyframes`
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
`;

const slideDown = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
`;

const slideUpAndFadeIn = keyframes`
 from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

const slideUpAndFadeOut = keyframes`
 from {
		opacity: 1;
		transform: translateY(0);
	}
	to {
		opacity: 0;
		transform: translateY(10px);
	}
`;

const slideDownAndFadeIn = keyframes`
from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

const slideDownAndFadeOut = keyframes`
from {
		opacity: 1;
		transform: translateY(0);
	}
	to {
		opacity: 0;
		transform: translateY(-10px);
	}
`;

const slideLeftAndFadeIn = keyframes`
 from {
		opacity: 0;
		transform: translateX(10px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
`;

const slideLeftAndFadeOut = keyframes`
 from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(10px);
	}
`;

const slideRightAndFadeIn = keyframes`
 	from {
		opacity: 0;
		transform: translateX(-10px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
`;

const slideRightAndFadeOut = keyframes`
 	from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(-10px);
	}
`;

export const animation = {
  fadeIn,
  fadeOut,
  fadeInAndPopup,
  slideUp,
  slideDown,
  slideUpAndFadeIn,
  slideUpAndFadeOut,
  slideDownAndFadeIn,
  slideDownAndFadeOut,
  slideLeftAndFadeIn,
  slideLeftAndFadeOut,
  slideRightAndFadeIn,
  slideRightAndFadeOut,
};
