import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DrawerContainer } from "../drawer/drawerContainer";

afterEach(() => {
	cleanup();
});

// jsdom has no AnimationEvent global, so React's animation-event plugin
// feature-detects support via CSS style props and falls back to listening
// for the vendor-prefixed "webkitAnimationEnd" DOM event instead of
// "animationend". Dispatching that prefixed event is what onAnimationEnd
// actually reacts to in this environment. It is wrapped in act() because a
// raw dispatchEvent call (unlike fireEvent) does not auto-flush the
// resulting React state updates.
function fireAnimationEnd(element: HTMLElement) {
	act(() => {
		element.dispatchEvent(
			new Event("webkitAnimationEnd", { bubbles: true, cancelable: true }),
		);
	});
}

describe("DrawerContainer", () => {
	it("should render without errors", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				Drawer content
			</DrawerContainer>,
		);

		expect(screen.getByText("Drawer content")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				Simple text
			</DrawerContainer>,
		);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<span>JSX child</span>
			</DrawerContainer>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<span>First</span>
				<span>Second</span>
			</DrawerContainer>,
		);

		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("should render nothing when isVisible is false and it never mounted", () => {
		const { container } = render(
			<DrawerContainer isVisible={false} makeInvisible={() => {}}>
				Drawer content
			</DrawerContainer>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				Content
			</DrawerContainer>,
		);

		const element = container.querySelector("aside") as HTMLElement;
		expect(element).toHaveClass("arkynDrawerContainer");
		expect(element).toHaveClass("left");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<DrawerContainer
				isVisible
				makeInvisible={() => {}}
				orientation="right"
				className="custom-class"
				id="drawer-id"
			>
				Content
			</DrawerContainer>,
		);

		const element = container.querySelector("aside") as HTMLElement;
		expect(element).toHaveClass(
			"arkynDrawerContainer",
			"right",
			"custom-class",
		);
		expect(element).toHaveAttribute("id", "drawer-id");
	});

	it("should render as an aside element", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				Content
			</DrawerContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("ASIDE");
	});

	it("should render an overlay element", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				Content
			</DrawerContainer>,
		);

		expect(
			container.querySelector(".arkynDrawerContainerOverlay"),
		).toBeInTheDocument();
	});

	it("should render a content wrapper element containing children", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<span>Wrapped</span>
			</DrawerContainer>,
		);

		const content = container.querySelector(".arkynDrawerContainerContent");
		expect(content).toBeInTheDocument();
		expect(content).toHaveTextContent("Wrapped");
	});

	describe("isVisible prop / mount lifecycle", () => {
		it("should mount and render content when isVisible is true", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			expect(container.querySelector("aside")).toBeInTheDocument();
		});

		it("should not immediately unmount when isVisible switches to false", () => {
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible={false} makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			expect(container.querySelector("aside")).toBeInTheDocument();
		});

		it("should add the 'exiting' class when isVisible switches to false", () => {
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible={false} makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("exiting");
		});

		it("should unmount (render null) after the overlay exit animation ends", () => {
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible={false} makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			fireAnimationEnd(overlay);

			expect(container).toBeEmptyDOMElement();
		});

		it("should call makeInvisible after the overlay exit animation ends", () => {
			const makeInvisible = vi.fn();
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible={false} makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			fireAnimationEnd(overlay);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should not call makeInvisible from the animationend when it bubbles from a different target", () => {
			const makeInvisible = vi.fn();
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible={false} makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			const aside = container.querySelector("aside") as HTMLElement;
			fireAnimationEnd(aside);

			expect(makeInvisible).not.toHaveBeenCalled();
		});

		it("should not call makeInvisible on animationend while not exiting", () => {
			const makeInvisible = vi.fn();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			fireAnimationEnd(overlay);

			expect(makeInvisible).not.toHaveBeenCalled();
		});

		it("should remount content again if isVisible becomes true after exiting started", () => {
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible={false} makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).not.toHaveClass("exiting");
		});
	});

	describe("orientation prop", () => {
		it("should apply the default 'left' orientation class when omitted", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("left");
			expect(element).not.toHaveClass("right");
		});

		it("should apply the 'right' orientation class when specified", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}} orientation="right">
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("right");
			expect(element).not.toHaveClass("left");
		});

		it("should replace the orientation class when changed", () => {
			const { container, rerender } = render(
				<DrawerContainer isVisible makeInvisible={() => {}} orientation="left">
					Content
				</DrawerContainer>,
			);

			let element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("left");

			rerender(
				<DrawerContainer isVisible makeInvisible={() => {}} orientation="right">
					Content
				</DrawerContainer>,
			);

			element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("right");
			expect(element).not.toHaveClass("left");
		});
	});

	describe("overlay click", () => {
		it("should add the 'exiting' class when the overlay is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			await user.click(overlay);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("exiting");
		});

		it("should call makeInvisible only after the exit animation ends following an overlay click", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(makeInvisible).not.toHaveBeenCalled();

			fireAnimationEnd(overlay);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});
	});

	describe("useScrollLock side effect", () => {
		it("should set document.body overflow to hidden while visible", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			expect(document.body.style.overflow).toBe("hidden");
		});

		it("should restore document.body overflow when unmounted", () => {
			const { unmount } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			expect(document.body.style.overflow).toBe("hidden");

			unmount();

			expect(document.body.style.overflow).toBe("");
		});

		it("should not lock body scroll when isVisible is false", () => {
			document.body.style.overflow = "";

			render(
				<DrawerContainer isVisible={false} makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			expect(document.body.style.overflow).toBe("");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("arkynDrawerContainer");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<DrawerContainer
					isVisible
					makeInvisible={() => {}}
					className="custom-class"
				>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("arkynDrawerContainer");
			expect(element).toHaveClass("custom-class");
		});

		it("should combine className with orientation and exiting classes", () => {
			const { container, rerender } = render(
				<DrawerContainer
					isVisible
					makeInvisible={() => {}}
					orientation="right"
					className="custom-class"
				>
					Content
				</DrawerContainer>,
			);

			rerender(
				<DrawerContainer
					isVisible={false}
					makeInvisible={() => {}}
					orientation="right"
					className="custom-class"
				>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass(
				"arkynDrawerContainer",
				"right",
				"exiting",
				"custom-class",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<DrawerContainer
					isVisible
					makeInvisible={() => {}}
					data-testid="drawer-root"
					aria-label="Navigation drawer"
				>
					Content
				</DrawerContainer>,
			);

			const element = screen.getByTestId("drawer-root");
			expect(element).toHaveAttribute("aria-label", "Navigation drawer");
		});

		it("should forward inline style", () => {
			const { container } = render(
				<DrawerContainer
					isVisible
					makeInvisible={() => {}}
					style={{ zIndex: 20 }}
				>
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveStyle({ zIndex: "20" });
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					{null}
				</DrawerContainer>,
			);

			expect(container.querySelector("aside")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					{undefined}
				</DrawerContainer>,
			);

			expect(container.querySelector("aside")).toBeInTheDocument();
		});

		it("should handle an empty className string", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}} className="">
					Content
				</DrawerContainer>,
			);

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("arkynDrawerContainer");
		});
	});

	describe("accessibility", () => {
		it("should render role=dialog and aria-modal on the content wrapper while open", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			const content = container.querySelector(
				".arkynDrawerContainerContent",
			) as HTMLElement;

			expect(content).toHaveAttribute("role", "dialog");
			expect(content).toHaveAttribute("aria-modal", "true");
		});

		it("should move focus into the content wrapper when opened", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<button type="button">Inside</button>
				</DrawerContainer>,
			);

			const content = container.querySelector(
				".arkynDrawerContainerContent",
			) as HTMLElement;

			expect(content).toContainElement(document.activeElement as HTMLElement);
		});

		it("should focus the content wrapper itself when it has no focusable children", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Plain text
				</DrawerContainer>,
			);

			const content = container.querySelector(
				".arkynDrawerContainerContent",
			) as HTMLElement;

			expect(content).toHaveFocus();
		});

		it("should start the exit transition when Escape is pressed", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					Content
				</DrawerContainer>,
			);

			fireEvent.keyDown(document, { key: "Escape" });

			const element = container.querySelector("aside") as HTMLElement;
			expect(element).toHaveClass("exiting");
		});

		it("should call makeInvisible once the Escape-triggered exit animation ends", () => {
			const makeInvisible = vi.fn();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					Content
				</DrawerContainer>,
			);

			fireEvent.keyDown(document, { key: "Escape" });

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			fireAnimationEnd(overlay);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should trap Tab so it wraps from the last focusable element to the first", async () => {
			const user = userEvent.setup();
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<button type="button">First</button>
					<button type="button">Last</button>
				</DrawerContainer>,
			);

			const first = screen.getByRole("button", { name: "First" });
			const last = screen.getByRole("button", { name: "Last" });

			expect(first).toHaveFocus();

			last.focus();
			await user.tab();

			expect(first).toHaveFocus();
		});

		it("should trap Shift+Tab so it wraps from the first focusable element to the last", async () => {
			const user = userEvent.setup();
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<button type="button">First</button>
					<button type="button">Last</button>
				</DrawerContainer>,
			);

			const first = screen.getByRole("button", { name: "First" });
			const last = screen.getByRole("button", { name: "Last" });

			expect(first).toHaveFocus();

			await user.tab({ shift: true });

			expect(last).toHaveFocus();
		});

		it("should return focus to the trigger element after the drawer fully closes", async () => {
			const user = userEvent.setup();

			function Wrapper() {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<>
						<button type="button" onClick={() => setIsOpen(true)}>
							Open drawer
						</button>
						<DrawerContainer
							isVisible={isOpen}
							makeInvisible={() => setIsOpen(false)}
						>
							<button type="button">Inside</button>
						</DrawerContainer>
					</>
				);
			}

			const { container } = render(<Wrapper />);
			const trigger = screen.getByRole("button", { name: "Open drawer" });

			await user.click(trigger);
			// The container mounts one render after `isVisible` flips (an internal
			// `mounted` state toggle), so focus moves into the dialog on the
			// following effect flush rather than synchronously with the click.
			await waitFor(() => expect(trigger).not.toHaveFocus());

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			await user.click(overlay);
			fireAnimationEnd(overlay);

			expect(trigger).toHaveFocus();
		});
	});
});
