import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { SwapTokenBalance } from "./index";

describe("", () => {
  it("test", () => {
    const tokenMock = {
      amount: 100
    };
    const aux = jest.fn();
    render(
      <SwapTokenBalance
        token={tokenMock}
        amountSwapToken={1}
        amountSwapTokenSetter={aux}
      />
    );
    fireEvent.click(screen.getByText('MAX'))
    expect(aux).toBeCalled()
  });
});
