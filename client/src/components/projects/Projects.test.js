import React from "react";
import { shallow, mount } from "enzyme";
import Projects from "./Projects";
import Base from '../common/Base';
import LinedTitle from '../common/LinedTitle';

const setUp = (props={}) => mount(<Projects {...props} />);

describe('Projects Component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setUp();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with base', () => {
        const base = wrapper.find(Base);
        expect(base.exists()).toBe(true);
    });

    it('lined title should exist', () => {
        const title = wrapper.find(LinedTitle);
        expect(title.exists()).toBe(true);
    });

    it('lined title should say Projects', () => {
        const title = wrapper.find(LinedTitle);
        expect(title.props().title).toBe("Projects");
    });
});