import * as reactTest from "@testing-library/react";
import React from "react";
import ModalView from "./ModalView";

describe("ModalView", () => {
    it("should reander all children", () => {
        const modalView = reactTest.render(<ModalView onClose={() => {
            fail("This should not happen");
        }}>
            <div>child1</div>
            <div>child2</div>
        </ModalView>);

        expect(modalView.getByText("child1")).toBeVisible();
        expect(modalView.getByText("child2")).toBeVisible();
    });

    it("should call the onClose clalback when clicked", () => {
        const onCloseCallback = jest.fn();
        const modalView = reactTest.render(<ModalView onClose={onCloseCallback}/>);

        reactTest.fireEvent.click(modalView.getByTitle("close"));

        expect(onCloseCallback).toBeCalled();
    });
});
