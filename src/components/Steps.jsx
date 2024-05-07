// I have 2 steps: "Enter Info", and "Start"

function Steps({ curStep }) {
  return (
    <ul className="steps steps-horizontal w-96">
      <li className={`step step-primary`}>Enter Info</li>
      <li className={`step ${curStep > 1 ? "step-primary" : ""}`}>Start</li>
    </ul>
  );
}

export default Steps;
