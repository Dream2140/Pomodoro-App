import * as reportsTemplate from '../template/reports.hbs';
import * as reportsTable from '../template/reportsTable.hbs';
import { router } from '../../../routes';

/**
 * @description manages view of reports page
 * @exports ReportView
 * @class ReportView
 */
export class ReportsView {

    /**
     * @description Creates an instance of ReportView.
     * @param {object} model instance of ReportModel
     * @memberof ReportView
     */
    constructor(model) {
        this.model = model;

        this.model.renderPageContainerEvent.subscribe(this.renderReportsPage.bind(this));

    }

    /**
     * @description renders reports page
     * @memberof ReportView
     */
    renderReportsPage() {

        document.body.innerHTML = reportsTemplate(this.model.repotsPageSettings);
        document.querySelector('.reports').addEventListener('click', () => this.addReportsTabEvents());
    }

    /**
     * @description renders table with report data
     * @param {object} tabsData data for render table
     * @memberof ReportView
     */
    renderReportsTable(dataForRender) {

        document.querySelector('#reportsGraph').innerHTML = reportsTable(dataForRender[0]);
    }

    /**
     * @description changes route depending on the tabs value
     * @memberof ReportView
     */
    addReportsTabEvents() {
        const topTabs = document.querySelector('.reports__top-tabs');
        const bottomTabs = document.querySelector('.reports__bottom-tabs');
        const currentCategory = bottomTabs.querySelector('.tab__btn--active')
            .dataset.reportsCategory;
        const currentPeriod = topTabs.querySelector('.tab__btn--active').dataset
            .reportsPeriod;
        if (currentCategory && currentPeriod) {
            router.navigate(`/reports/${currentPeriod}/${currentCategory}`);
        }
    }
}