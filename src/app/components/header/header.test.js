/* eslint-disable no-undef */
import checkActiveState from './template/checkActivePage';
import headerTemplate from './template/header.hbs';

it('renders correctly', () => {
    const tree = JSON.stringify(headerTemplate());
    expect(tree).toMatchSnapshot();
});

describe('handlebars helpers', () => {
    let windowSpy;

    beforeEach(() => {
        windowSpy = jest.spyOn(window, 'window', 'get');
        windowSpy.mockImplementation(() => ({
            location: {
                pathname: '/settings/pomodoros',
            },
        }));
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    it('should return active btn css class', () => {
        const result = checkActiveState('settings');
        const truthyResult = 'navigation__btn--active';

        expect(truthyResult).toEqual(result);
    });

    it('should be undefined.', () => {
        const result = checkActiveState('wrong data');

        expect(result).toBeUndefined();
    });
});
