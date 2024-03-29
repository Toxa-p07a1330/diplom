import React, { Component, Fragment } from 'react';
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
}

class PaginationComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageLimit: this.props.pageLimit,
            totalRecords: this.props.totalRecords,
            pageNeighbours: this.props.pageNeighbours,
            currentPage: 1,
            totalPages: Math.ceil(this.props.totalRecords / this.props.pageLimit),
        }
    }

    fetchPageNumbers = (totalPages) => {

        const currentPage = this.state.currentPage;
        const pageNeighbours = this.state.pageNeighbours;

        /**
         * totalNumbers: the total page numbers to show on the control
         * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
         */
        const totalNumbers = (this.state.pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {

            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                // handle: (1) {2 3} [4] {5 6} > (10)
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                // handle: (1) < {4 5} [6] {7 8} > (10)
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }

            return [1, ...pages, totalPages];

        }

        return range(1, totalPages);

    }
    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("paginationComponent", this.context.data.lang);
        this.forceUpdate();

        this.gotoPage(1);
    }

    gotoPage = page => {
        const { onPageChanged = f => f } = this.props;

        this.setState({ currentPage: page }, () => onPageChanged(page));

    }

    handleClick = page => evt => {
        evt.preventDefault();
        this.gotoPage(page);
    }

    handleMoveLeft = evt => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage - (this.state.pageNeighbours * 2) - 1);
    }

    handleMoveRight = evt => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage + (this.state.pageNeighbours * 2) + 1);
    }

    render() {
        const totalRecords = this.props.totalRecords;
        const totalPages = Math.ceil(this.props.totalRecords / this.state.pageLimit);

        if (!totalRecords || totalPages === 1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers(totalPages);

        return (
            <Fragment>
                <nav aria-label="Pagination">
                    <ul className="pagination">
                        { pages.map((page, index) => {

                            if (page === LEFT_PAGE) return (
                                <li key={index} className="page-item">
                                    <button className="page-link" aria-label="Previous" onClick={this.handleMoveLeft}>
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">{this.activeTranslation.Previous}</span>
                                    </button>
                                </li>
                            );

                            if (page === RIGHT_PAGE) return (
                                <li key={index} className="page-item">
                                    <button className="page-link" aria-label="Next" onClick={this.handleMoveRight}>
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">{this.activeTranslation.Next}</span>
                                    </button>
                                </li>
                            );

                            return (
                                <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                                    <button className="page-link"  onClick={ this.handleClick(page) }>{ page }</button>
                                </li>
                            );

                        }) }

                    </ul>
                </nav>
            </Fragment>
        );
    }
}

export default PaginationComponent;

