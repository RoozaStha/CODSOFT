const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let input = "";

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (value === "=") {
      try {
        display.value = eval(input);
        input = display.value;
      } catch {
        display.value = "Error";
        input = "";
      }
    } else {
      input += value;
      display.value = input;
    }
  });
});
