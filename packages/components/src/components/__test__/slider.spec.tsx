import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Slider } from "../slider";

function mockTrackRect(element: HTMLElement) {
	vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
		x: 0,
		y: 0,
		width: 200,
		height: 6,
		top: 0,
		left: 0,
		right: 200,
		bottom: 6,
		toJSON: () => {},
	});
}

describe("Slider", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		const { container } = render(<Slider value={50} onChange={vi.fn()} />);

		expect(container.querySelector(".arkynSliderTrack")).toBeInTheDocument();
	});

	it("should render the fill and thumb elements", () => {
		const { container } = render(<Slider value={30} onChange={vi.fn()} />);

		expect(container.querySelector(".arkynSliderFill")).toBeInTheDocument();
		expect(container.querySelector(".arkynSliderThumb")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Slider value={0} onChange={vi.fn()} />);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynSliderTrack");
		expect(element).toHaveClass("isNotDragging");
		expect(element).toHaveClass("isEnabled");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<Slider
				value={60}
				onChange={vi.fn()}
				disabled={false}
				onDragging={vi.fn()}
				className="custom-class"
				id="volume-slider"
			/>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass(
			"arkynSliderTrack",
			"isEnabled",
			"custom-class",
		);
		expect(element).toHaveAttribute("id", "volume-slider");
	});

	describe("value prop", () => {
		it("should reflect value as the fill width", () => {
			const { container } = render(<Slider value={40} onChange={vi.fn()} />);

			const fill = container.querySelector(".arkynSliderFill") as HTMLElement;
			expect(fill).toHaveStyle({ width: "40%" });
		});

		it("should reflect value as the thumb left position", () => {
			const { container } = render(<Slider value={40} onChange={vi.fn()} />);

			const thumb = container.querySelector(".arkynSliderThumb") as HTMLElement;
			expect(thumb).toHaveStyle({ left: "40%" });
		});

		it("should reflect a value of 0", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const fill = container.querySelector(".arkynSliderFill") as HTMLElement;
			const thumb = container.querySelector(".arkynSliderThumb") as HTMLElement;
			expect(fill).toHaveStyle({ width: "0%" });
			expect(thumb).toHaveStyle({ left: "0%" });
		});

		it("should reflect a value of 100", () => {
			const { container } = render(<Slider value={100} onChange={vi.fn()} />);

			const fill = container.querySelector(".arkynSliderFill") as HTMLElement;
			const thumb = container.querySelector(".arkynSliderThumb") as HTMLElement;
			expect(fill).toHaveStyle({ width: "100%" });
			expect(thumb).toHaveStyle({ left: "100%" });
		});

		it("should update the fill and thumb when value changes", () => {
			const { container, rerender } = render(
				<Slider value={20} onChange={vi.fn()} />,
			);

			let fill = container.querySelector(".arkynSliderFill") as HTMLElement;
			expect(fill).toHaveStyle({ width: "20%" });

			rerender(<Slider value={80} onChange={vi.fn()} />);
			fill = container.querySelector(".arkynSliderFill") as HTMLElement;
			expect(fill).toHaveStyle({ width: "80%" });
		});
	});

	describe("onChange event", () => {
		it("should call onChange when the track is clicked", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.click(track, { clientX: 100 });

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith(50);
		});

		it("should clamp onChange value to 0 when clicking before the track start", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.click(track, { clientX: -50 });

			expect(handleChange).toHaveBeenCalledWith(0);
		});

		it("should clamp onChange value to 100 when clicking past the track end", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.click(track, { clientX: 500 });

			expect(handleChange).toHaveBeenCalledWith(100);
		});

		it("should call onChange while dragging via mousemove", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);
			fireEvent.mouseMove(document, { clientX: 150 });

			expect(handleChange).toHaveBeenCalledWith(75);
		});

		it("should stop calling onChange after mouseup ends the drag", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);
			fireEvent.mouseMove(document, { clientX: 150 });
			expect(handleChange).toHaveBeenCalledTimes(1);

			fireEvent.mouseUp(document);
			fireEvent.mouseMove(document, { clientX: 20 });

			expect(handleChange).toHaveBeenCalledTimes(1);
		});

		it("should not call onChange from mousemove when never dragging", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseMove(document, { clientX: 150 });

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("onDragging callback", () => {
		it("should not require onDragging to be provided", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			expect(() => {
				fireEvent.mouseDown(track);
				fireEvent.mouseUp(document);
			}).not.toThrow();
		});

		it("should call onDragging with true when dragging starts", () => {
			const handleDragging = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} onDragging={handleDragging} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);

			expect(handleDragging).toHaveBeenCalledWith(true);
		});

		it("should call onDragging with false when dragging ends", () => {
			const handleDragging = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} onDragging={handleDragging} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);
			handleDragging.mockClear();

			fireEvent.mouseUp(document);

			expect(handleDragging).toHaveBeenCalledWith(false);
		});

		it("should call onDragging with false on initial mount", () => {
			const handleDragging = vi.fn();
			render(
				<Slider value={0} onChange={vi.fn()} onDragging={handleDragging} />,
			);

			expect(handleDragging).toHaveBeenCalledWith(false);
		});
	});

	describe("disabled state", () => {
		it("should apply the isDisabled class when disabled", () => {
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} disabled />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("isDisabled");
			expect(element).not.toHaveClass("isEnabled");
		});

		it("should apply the isEnabled class by default", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("isEnabled");
			expect(element).not.toHaveClass("isDisabled");
		});

		it("should apply the isEnabled class when disabled is explicitly false", () => {
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} disabled={false} />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("isEnabled");
		});

		it("should not call onChange when clicking while disabled", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} disabled />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.click(track, { clientX: 100 });

			expect(handleChange).not.toHaveBeenCalled();
		});

		it("should not call onChange when dragging while disabled", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} disabled />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);
			fireEvent.mouseMove(document, { clientX: 150 });

			expect(handleChange).not.toHaveBeenCalled();
		});

		it("should still track internal dragging state visually when disabled", () => {
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} disabled />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);

			expect(track).toHaveClass("isDragging");
			expect(track).toHaveClass("isDisabled");
		});
	});

	describe("dragging visual state", () => {
		it("should apply isNotDragging class before interaction", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("isNotDragging");
		});

		it("should apply isDragging class after mousedown", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);

			expect(track).toHaveClass("isDragging");
			expect(track).not.toHaveClass("isNotDragging");
		});

		it("should return to isNotDragging class after mouseup", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);
			fireEvent.mouseUp(document);

			expect(track).toHaveClass("isNotDragging");
			expect(track).not.toHaveClass("isDragging");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynSliderTrack");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} className="custom-class" />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynSliderTrack");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render base and state classes when className is omitted", () => {
			const { container } = render(<Slider value={0} onChange={vi.fn()} />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynSliderTrack");
			expect(element).toHaveClass("isEnabled");
			expect(element).toHaveClass("isNotDragging");
		});

		it("should handle an empty className string", () => {
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} className="" />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynSliderTrack");
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<Slider
					value={0}
					onChange={vi.fn()}
					data-testid="slider-root"
					aria-label="Volume"
				/>,
			);

			const element = screen.getByTestId("slider-root");
			expect(element).toHaveAttribute("aria-label", "Volume");
		});

		it("should forward id attribute", () => {
			render(<Slider value={0} onChange={vi.fn()} id="slider-id" />);

			expect(document.getElementById("slider-id")).toBeInTheDocument();
		});

		it("should forward inline style merged with internal styles", () => {
			const { container } = render(
				<Slider value={0} onChange={vi.fn()} style={{ marginTop: "10px" }} />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("ref forwarding", () => {
		it("should not crash when rendered without a ref prop", () => {
			expect(() =>
				render(<Slider value={0} onChange={vi.fn()} />),
			).not.toThrow();
		});
	});

	describe("edge cases", () => {
		it("should handle a decimal value", () => {
			const { container } = render(<Slider value={33.33} onChange={vi.fn()} />);

			const fill = container.querySelector(".arkynSliderFill") as HTMLElement;
			expect(fill).toHaveStyle({ width: "33.33%" });
		});

		it("should handle rapid successive clicks by calling onChange each time", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			await user.click(track);
			await user.click(track);

			expect(handleChange).toHaveBeenCalledTimes(2);
		});

		it("should not throw when getBoundingClientRect returns a zero width track", () => {
			const handleChange = vi.fn();
			const { container } = render(
				<Slider value={0} onChange={handleChange} />,
			);

			const track = container.firstChild as HTMLElement;

			expect(() => {
				fireEvent.click(track, { clientX: 10 });
			}).not.toThrow();
		});
	});

	describe("accessibility (A11Y-05)", () => {
		it("should expose role='slider' with aria-valuemin/max/now", () => {
			render(<Slider value={40} onChange={vi.fn()} />);

			const slider = screen.getByRole("slider");
			expect(slider).toHaveAttribute("aria-valuemin", "0");
			expect(slider).toHaveAttribute("aria-valuemax", "100");
			expect(slider).toHaveAttribute("aria-valuenow", "40");
		});

		it("should update aria-valuenow when the value prop changes", () => {
			const { rerender } = render(<Slider value={10} onChange={vi.fn()} />);
			expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "10");

			rerender(<Slider value={90} onChange={vi.fn()} />);
			expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "90");
		});

		it("should be focusable via tab", async () => {
			const user = userEvent.setup();
			render(<Slider value={0} onChange={vi.fn()} />);

			await user.tab();

			expect(screen.getByRole("slider")).toHaveFocus();
		});

		it("should not be focusable via tab when disabled", async () => {
			const user = userEvent.setup();
			render(<Slider value={0} onChange={vi.fn()} disabled />);

			await user.tab();

			expect(screen.getByRole("slider")).not.toHaveFocus();
		});

		it("should expose aria-disabled when disabled", () => {
			render(<Slider value={0} onChange={vi.fn()} disabled />);

			expect(screen.getByRole("slider")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		it("should not have aria-disabled when enabled", () => {
			render(<Slider value={0} onChange={vi.fn()} />);

			expect(screen.getByRole("slider")).not.toHaveAttribute("aria-disabled");
		});

		describe("keyboard navigation", () => {
			it("should increase the value by step on ArrowRight", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{ArrowRight}");

				expect(handleChange).toHaveBeenCalledWith(51);
			});

			it("should increase the value by step on ArrowUp", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{ArrowUp}");

				expect(handleChange).toHaveBeenCalledWith(51);
			});

			it("should decrease the value by step on ArrowLeft", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{ArrowLeft}");

				expect(handleChange).toHaveBeenCalledWith(49);
			});

			it("should decrease the value by step on ArrowDown", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{ArrowDown}");

				expect(handleChange).toHaveBeenCalledWith(49);
			});

			it("should respect a custom step size", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} step={5} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{ArrowRight}");

				expect(handleChange).toHaveBeenCalledWith(55);
			});

			it("should jump to 0 on Home", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{Home}");

				expect(handleChange).toHaveBeenCalledWith(0);
			});

			it("should jump to 100 on End", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{End}");

				expect(handleChange).toHaveBeenCalledWith(100);
			});

			it("should move by a larger increment on PageUp/PageDown", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{PageUp}");
				expect(handleChange).toHaveBeenLastCalledWith(60);

				await user.keyboard("{PageDown}");
				expect(handleChange).toHaveBeenLastCalledWith(40);
			});

			it("should clamp keyboard movement at 0 and 100", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={0} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("{ArrowLeft}");

				expect(handleChange).toHaveBeenCalledWith(0);
			});

			it("should not respond to keyboard input when disabled", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} disabled />);

				const slider = screen.getByRole("slider");
				slider.focus();
				await user.keyboard("{ArrowRight}");

				expect(handleChange).not.toHaveBeenCalled();
			});

			it("should ignore unrelated keys", async () => {
				const user = userEvent.setup();
				const handleChange = vi.fn();
				render(<Slider value={50} onChange={handleChange} />);

				screen.getByRole("slider").focus();
				await user.keyboard("a");

				expect(handleChange).not.toHaveBeenCalled();
			});
		});

		describe("touch interaction", () => {
			it("should call onChange on touch start at a given position", () => {
				const handleChange = vi.fn();
				const { container } = render(
					<Slider value={0} onChange={handleChange} />,
				);

				const track = container.firstChild as HTMLElement;
				mockTrackRect(track);

				fireEvent.touchStart(track, {
					touches: [{ clientX: 100 }],
				});

				expect(handleChange).toHaveBeenCalledWith(50);
			});

			it("should call onChange while dragging via touchmove", () => {
				const handleChange = vi.fn();
				const { container } = render(
					<Slider value={0} onChange={handleChange} />,
				);

				const track = container.firstChild as HTMLElement;
				mockTrackRect(track);

				fireEvent.touchStart(track, { touches: [{ clientX: 0 }] });
				fireEvent.touchMove(document, { touches: [{ clientX: 150 }] });

				expect(handleChange).toHaveBeenLastCalledWith(75);
			});

			it("should stop calling onChange after touchend ends the drag", () => {
				const handleChange = vi.fn();
				const { container } = render(
					<Slider value={0} onChange={handleChange} />,
				);

				const track = container.firstChild as HTMLElement;
				mockTrackRect(track);

				fireEvent.touchStart(track, { touches: [{ clientX: 0 }] });
				fireEvent.touchEnd(document);
				handleChange.mockClear();

				fireEvent.touchMove(document, { touches: [{ clientX: 150 }] });

				expect(handleChange).not.toHaveBeenCalled();
			});

			it("should not call onChange on touch start when disabled", () => {
				const handleChange = vi.fn();
				const { container } = render(
					<Slider value={0} onChange={handleChange} disabled />,
				);

				const track = container.firstChild as HTMLElement;
				mockTrackRect(track);

				fireEvent.touchStart(track, { touches: [{ clientX: 100 }] });

				expect(handleChange).not.toHaveBeenCalled();
			});

			it("should set isDragging state on touch start", () => {
				const { container } = render(<Slider value={0} onChange={vi.fn()} />);

				const track = container.firstChild as HTMLElement;
				mockTrackRect(track);

				fireEvent.touchStart(track, { touches: [{ clientX: 100 }] });

				expect(track).toHaveClass("isDragging");
			});
		});
	});

	describe("integration between properties", () => {
		it("should keep isDisabled class and block onChange even while dragging state is active", () => {
			const handleChange = vi.fn();
			const handleDragging = vi.fn();
			const { container } = render(
				<Slider
					value={50}
					onChange={handleChange}
					onDragging={handleDragging}
					disabled
				/>,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);
			fireEvent.mouseMove(document, { clientX: 150 });

			expect(track).toHaveClass("isDisabled");
			expect(track).toHaveClass("isDragging");
			expect(handleChange).not.toHaveBeenCalled();
			expect(handleDragging).toHaveBeenCalledWith(true);
		});

		it("should combine disabled, dragging and custom className classes together", () => {
			const { container } = render(
				<Slider
					value={0}
					onChange={vi.fn()}
					disabled
					className="custom-class"
				/>,
			);

			const track = container.firstChild as HTMLElement;
			mockTrackRect(track);

			fireEvent.mouseDown(track);

			expect(track).toHaveClass(
				"arkynSliderTrack",
				"isDragging",
				"isDisabled",
				"custom-class",
			);
		});
	});
});
