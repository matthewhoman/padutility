import React from "react";
import { shallow, mount } from "enzyme";
import Contact from "./Contact";
import Base from '../common/Base';
import LinedTitle from '../common/LinedTitle';

const setUp = (props={}) => mount(<Contact {...props} />);

describe('Contact Component', () => {
    let wrapper;
    //const useStateSpy = jest.spyOn(React, 'useState')
    //useStateSpy.mockImplementation((init) => [init, setState]);

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

    it('lined title should say contact', () => {
        const title = wrapper.find(LinedTitle);
        expect(title.props().title).toBe("Contact");
    });

    it('should render contact form', () => {
        const form = wrapper.find("form");
        expect(form.exists()).toBe(true);
    });
        // const form = wrapper.find(`[data-test='form']`);
        // let nameInput = wrapper.find(`[data-test='nameInput']`);
        // const subjectInput = wrapper.find(`[data-test='subjectInput']`);
        // const messageTextArea = wrapper.find(`[data-test='messageTextArea']`);
        
        // nameInput.simulate('change', {target: {value: 'name'}})
        // subjectInput.simulate('change', {target: {value: 'subject'}})
        // messageTextArea.simulate('change', {target: {value: 'message'}})

        // form.simulate('submit');

        // nameInput = wrapper.find(`[data-test='nameInput']`);

        // expect(nameInput.val()).toBe("name");

        //wrapper.find('span');
        //wrapper.find('h2.total').text(); element.classname

        //expect(something).toBe("");

        //simulate button click
        //const button = wrapper.find('button')
                                      //`[data-test='id']` //search by test attribute instead
        //button.simulate('click');

        //test component exists
        //const contact = wrapper.find(Contact)
        //expect(contact.exists()).toBe(true);
});