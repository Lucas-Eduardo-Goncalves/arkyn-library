import { Slider, useSlider } from "@components";
import { Box } from "../ui/box";
import { Row } from "../ui/row";

function SliderExamples() {
  const [sliderValue, changeSliderValue] = useSlider();
  const [disabledSliderValue, changeDisabledSliderValue] = useSlider(50);

  return (
    <Box title="Slider">
      <Row>
        <Slider onChange={changeSliderValue} value={sliderValue} />
        <p>{sliderValue}</p>
      </Row>

      <Row>
        <Slider
          disabled
          onChange={changeDisabledSliderValue}
          value={disabledSliderValue}
        />
        <p>{disabledSliderValue}</p>
      </Row>
    </Box>
  );
}

export { SliderExamples };
