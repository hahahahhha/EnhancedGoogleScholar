// ==UserScript==
// @name         Google Scholar Enhancer
// @namespace    https://greasyfork.org/users/YourUserName
// @version      0.8.6
// @description  Enhance Google Scholar with column layout options, auto-paging, and advanced search features
// @author       knox, myself
// @license      MIT
// @match        *://scholar.google.com/*
// @match        *://scholar.google.com.au/*
// @match        *://scholar.google.co.uk/*
// @match        *://scholar.google.ca/*
// @match        *://scholar.google.com.hk/*
// @match        *://scholar.google.co.in/*
// @match        *://scholar.google.co.jp/*
// @match        *://scholar.google.de/*
// @match        *://scholar.google.fr/*
// @match        *://scholar.google.es/*
// @match        *://scholar.google.it/*
// @match        *://scholar.google.nl/*
// @match        *://scholar.google.com.sg/*
// @icon         https://www.google.com/s2/favicons?domain=scholar.google.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/511179/Google%20Scholar%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/511179/Google%20Scholar%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        columnLayout: GM_getValue('columnLayout', 1),
        autoPagingEnabled: GM_getValue('autoPagingEnabled', true),
        bibtexCopyEnabled: GM_getValue('bibtexCopyEnabled', true),
        bibtexCopyAlert: GM_getValue('bibtexCopyAlert', true),
        singleResultRedirect: GM_getValue('singleResultRedirect', true),
        showFrequentScholars: GM_getValue('showFrequentScholars', true),
        language: GM_getValue('language', 'en'),
        searchPresets: GM_getValue('searchPresets', []),
        showPublicationYearDistribution: GM_getValue('showPublicationYearDistribution', true),
        autoPagingMaxPages: GM_getValue('autoPagingMaxPages', 5), // 默认最多5页
        autoPagingMaxItems: GM_getValue('autoPagingMaxItems', 100) // 默认最多100条
    };

    const translations = {
        en: {
            // Search interface
            settings: '⚙️ Settings',
            keywords: 'Keywords:',
            exactPhrase: 'Exact phrase:',
            without: 'Without:',
            author: 'Author:',
            publishedIn: 'Published in:',
            titleOnly: 'Title only',
            apply: 'Apply',
            allOfTheWords: 'All of the words',
            withoutWords: 'Without words',
            journalOrConference: 'Journal or conference',

            // Settings modal
            settingsTitle: 'Google Scholar Enhancer Settings',
            save: 'Save',
            close: 'Close',
            language: 'Language',

            // Layout options
            layoutOptions: 'Layout Options',
            columnLayout: 'Column Layout:',
            singleColumn: 'Single Column',
            twoColumns: 'Two Columns',
            threeColumns: 'Three Columns',

            // Navigation options
            navigationOptions: 'Navigation Options',
            enableAutoPaging: 'Enable Automatic Page Turning',
            autoRedirect: 'Auto-redirect for Single Results',

            // BibTeX options
            bibtexOptions: 'B\u200BibTeX Options',
            enableDirectBibtex: 'Enable Direct B\u200BibTeX Copying',
            showBibtexAlert: 'Show Alert on B\u200BibTeX Copy',

            // Additional features
            additionalFeatures: 'Additional Features',
            showFrequentScholars: 'Show Frequent Scholars',
            publicationYearDistribution: 'Publication Year Distribution',
            showPublicationYearDistribution: 'Show Publication Year Distribution',

            // Presets
            savePreset: 'Save Preset',
            selectPreset: 'Select Preset',
            enterPresetName: 'Enter a name for this preset:',

            // Select components
            selectPublishedIn: 'Select venue',
            conferences: 'Conferences',
            journals: 'Journals',
            selectDefault: 'Select default',
            addNew: 'Add new...',
            enterNewValue: 'Enter a new value:',

            // Loading limits
            maxPagesToLoad: "Max Pages to Load",
            maxItemsToLoad: "Max Items to Load",

            // Publication management
            moreOptions: "More options",
            publicationManagement: "Publication Management",
            applySelected: "Apply selected",
            saveAsGroup: "Save as group",
            publicationCategories: "Publication categories",
            manageCategories: "Manage categories",
            manageItems: "Manage items",
            manageItemsFor: "Manage items for ",
            selectPublications: "Select publications",
            savedGroups: "Saved groups",
            groupName: "Group name",
            createGroup: "Create group",
            rename: "Rename",
            copy: "Copy",
            newCategory: "New category name",
            newItem: "New item name",
            add: "Add",
            edit: "Edit",
            delete: "Delete",
            enterNewName: "Enter new name",
            confirmDeleteCategory: "Are you sure you want to delete this category and all its items?",
            confirmDeleteGroup: "Are you sure you want to delete this group?",
            confirmDeleteItem: "Are you sure you want to delete this item?",
            enterGroupName: "Enter group name",
            saveOrCreateGroup: "Save/Create group",
            clickManageToView: "Click manage button above to view categories",
            manageCategoriesFirst: "Please manage categories first to view items",
            noItemsSelected: "Please select at least one item",
            updateGroup: "Update Group",
        },
        zh: {
            // Search interface
            settings: '⚙️ 设置',
            keywords: '关键词：',
            exactPhrase: '精确短语：',
            without: '不包含：',
            author: '作者：',
            publishedIn: '发表于：',
            titleOnly: '仅标题',
            apply: '应用',
            allOfTheWords: '包含所有这些词',
            withoutWords: '不包含这些词',
            journalOrConference: '期刊或会议',

            // Settings modal
            settingsTitle: 'Google Scholar 增强设置',
            save: '保存',
            close: '关闭',
            language: '语言',

            // Layout options
            layoutOptions: '布局选项',
            columnLayout: '列局：',
            singleColumn: '单列',
            twoColumns: '双列',
            threeColumns: '三列',

            // Navigation options
            navigationOptions: '导航选项',
            enableAutoPaging: '启用自动翻页',
            autoRedirect: '单一结果自动重定向',

            // BibTeX options
            bibtexOptions: 'B\u200BibTeX 选项',
            enableDirectBibtex: '启用直接 B\u200BibTeX 复制',
            showBibtexAlert: '显示 B\u200BibTeX 复制提醒',

            // Additional features
            additionalFeatures: '附加功能',
            showFrequentScholars: '显示常见学者',
            publicationYearDistribution: '发表年份分布',
            showPublicationYearDistribution: '显示发表年份分布',

            // Presets
            savePreset: '保存预设',
            selectPreset: '选择预设',
            enterPresetName: '输入此预设的名称：',

            // Select components
            selectPublishedIn: '选择表场所',
            conferences: '会议',
            journals: '期刊',
            selectDefault: '选择默认值',
            addNew: '添加新值...',
            enterNewValue: '输入新值：',

            // Loading limits
            maxPagesToLoad: "最大加载页数",
            maxItemsToLoad: "最大加载条目数",

            // Publication management
            moreOptions: "更多选项",
            publicationManagement: "出版物管理",
            applySelected: "应用所选",
            saveAsGroup: "保存为组",
            publicationCategories: "出版商分类",
            manageCategories: "管理分类",
            manageItems: "管理项目",
            manageItemsFor: "管理项目 - ",
            selectPublications: "选择出版商",
            savedGroups: "已保存的组",
            groupName: "组名",
            createGroup: "创建组",
            rename: "重命名",
            copy: "复制",
            newCategory: "新分类名称",
            newItem: "新项目名称",
            add: "添加",
            edit: "编辑",
            delete: "删除",
            enterNewName: "请输入新名称",
            confirmDeleteCategory: "确定删除这个分类及其所有项目吗？",
            confirmDeleteGroup: "确定删除这个组吗？",
            confirmDeleteItem: "确定删除这个项目吗？",
            enterGroupName: "请输入组名",
            saveOrCreateGroup: "保存/创建组",
            clickManageToView: "点击上方管理按钮查看分类",
            manageCategoriesFirst: "请先管理分类以查看项目",
            noItemsSelected: "请至少选择一个项目",
            updateGroup: "Update Group",
        }
    };

    const styles = {
        singleColumn: `
            #gs_res_ccl_mid {
                display: block;
                max-width: 100%;
                margin: 0 auto;
            }
        `,
        doubleColumn: `
            #gs_res_ccl_mid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-gap: 20px;
                max-width: 90vw;
                margin: 0 auto;
            }
            .gs_r.gs_or.gs_scl {
                width: 100%;
            }
        `,
        tripleColumn: `
            #gs_res_ccl_mid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-gap: 20px;
                max-width: 95vw;
                margin: 0 auto;
            }
            .gs_r.gs_or.gs_scl {
                width: 100%;
            }
        `,
        common: `
            .gs_r.gs_or.gs_scl {
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                box-sizing: border-box;
            }
            #gs_top {
                max-width: 95vw;
                margin: 0 auto;
            }
            #gs_ab_md {
                max-width: none !important;
            }
        `
    };

    const DEFAULT_DATA = {
        categories: {
            'EDA Conferences': [
                'DAC',
                'Design Automation Conference',
                'ICCAD',
                'International Conference on Computer-Aided Design',
                'DATE',
                'Design, Automation & Test in Europe',
                'ASP-DAC',
                'Asia and South Pacific Design Automation Conference'
            ],
            'Computer Architecture Conferences': [
                'ISCA',
                'International Symposium on Computer Architecture',
                'MICRO',
                'IEEE/ACM International Symposium on Microarchitecture',
                'ASPLOS',
                'International Conference on Architectural Support for Programming Languages and Operating Systems',
                'HPCA',
                'IEEE International Symposium on High-Performance Computer Architecture'
            ],
            'Top Journals': [
                'IEEE Transactions on Computers',
                'IEEE TC',
                'IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems',
                'IEEE TCAD',
                'ACM Transactions on Architecture and Code Optimization',
                'ACM TACO',
                'ACM Transactions on Design Automation of Electronic Systems',
                'ACM TODAES'
            ]
        },
        groups: [
            {
                name: 'EDA Top Conferences',
                items: [
                    'DAC',
                    'Design Automation Conference',
                    'ICCAD',
                    'International Conference on Computer-Aided Design'
                ]
            },
            {
                name: 'Computer Architecture Top 4',
                items: [
                    'ISCA',
                    'International Symposium on Computer Architecture',
                    'MICRO',
                    'IEEE/ACM International Symposium on Microarchitecture',
                    'ASPLOS',
                    'International Conference on Architectural Support for Programming Languages and Operating Systems',
                    'HPCA',
                    'IEEE International Symposium on High-Performance Computer Architecture'
                ]
            },
            {
                name: 'Top Architecture Journals',
                items: [
                    'IEEE Transactions on Computers',
                    'IEEE TC',
                    'ACM Transactions on Architecture and Code Optimization',
                    'ACM TACO'
                ]
            }
        ]
    };
    function addStyles() {
        GM_addStyle(styles.common);
        switch (config.columnLayout) {
            case 1:
                GM_addStyle(styles.singleColumn);
                break;
            case 2:
                GM_addStyle(styles.doubleColumn);
                break;
            case 3:
                GM_addStyle(styles.tripleColumn);
                break;
        }
    }

    function createLayoutSwitcher() {
        const switcher = document.createElement('select');
        switcher.innerHTML = `
            <option value="1" ${config.columnLayout === 1 ? 'selected' : ''}>Single Column</option>
            <option value="2" ${config.columnLayout === 2 ? 'selected' : ''}>Two Columns</option>
            <option value="3" ${config.columnLayout === 3 ? 'selected' : ''}>Three Columns</option>
        `;
        switcher.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999;';
        switcher.addEventListener('change', (e) => {
            config.columnLayout = parseInt(e.target.value);
            GM_setValue('columnLayout', config.columnLayout);
            addStyles();
        });
        document.body.appendChild(switcher);
    }

    function createSettingsButton() {
        const lang = translations[config.language];
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 5px 10px;
            background-color: #f1f3f4;
            border-bottom: 1px solid #dadce0;
            z-index: 1100;
            font-size: 12px;
        `;

        container.appendChild(createSettingsButtonElement(lang));

        const advancedSearchFields = [
            { label: lang.keywords, id: 'all-words', width: '150px', placeholder: lang.allOfTheWords },
            { label: lang.exactPhrase, id: 'exact-phrase', width: '150px' },
            { label: lang.without, id: 'without-words', width: '150px', placeholder: lang.withoutWords },
            { label: lang.author, id: 'author', width: '150px' },
            { label: lang.publishedIn, id: 'publication', width: '150px', placeholder: lang.journalOrConference }
        ];

        advancedSearchFields.forEach((field, index) => {
            const fieldContainer = createFieldContainer(field, lang, index);
            container.appendChild(fieldContainer);
        });

        container.appendChild(createApplyButton(lang));

        const body = document.body;
        body.insertBefore(container, body.firstChild);
        body.style.paddingTop = `${container.offsetHeight}px`;
    }

    function createSettingsButtonElement(lang) {
        const settingsButton = document.createElement('button');
        settingsButton.id = 'settings-button';
        settingsButton.textContent = lang.settings;
        settingsButton.style.cssText = `
            padding: 5px 10px;
            margin-right: 10px;
            background-color: #fff;
            border: 1px solid #dadce0;
            border-radius: 4px;
            color: #202124;
            font-family: arial,sans-serif;
            font-size: 14px;
            cursor: pointer;
        `;
        settingsButton.addEventListener('click', openSettingsModal);
        return settingsButton;
    }

    /**
     * 出版物管理器 - 核心功能
     */
    class PublicationManager {
        constructor() {
            this.DEFAULT_DATA = {
                categories: {
                    'EDA Conferences': [
                        'DAC',
                        'Design Automation Conference',
                        'ICCAD',
                        'International Conference on Computer-Aided Design',
                        'DATE',
                        'Design, Automation & Test in Europe',
                        'ASP-DAC',
                        'Asia and South Pacific Design Automation Conference'
                    ],
                    'Computer Architecture Conferences': [
                        'ISCA',
                        'International Symposium on Computer Architecture',
                        'MICRO',
                        'IEEE/ACM International Symposium on Microarchitecture',
                        'ASPLOS',
                        'International Conference on Architectural Support for Programming Languages and Operating Systems',
                        'HPCA',
                        'IEEE International Symposium on High-Performance Computer Architecture'
                    ],
                    'Top Journals': [
                        'IEEE Transactions on Computers',
                        'IEEE TC',
                        'IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems',
                        'IEEE TCAD',
                        'ACM Transactions on Architecture and Code Optimization',
                        'ACM TACO',
                        'ACM Transactions on Design Automation of Electronic Systems',
                        'ACM TODAES'
                    ]
                },
                groups: [
                    {
                        name: 'EDA and Arch Top Conferences',
                        items: [
                            'DAC',
                            'Design Automation Conference',
                            'ICCAD',
                            'International Conference on Computer-Aided Design',
                            'ISCA',
                            'International Symposium on Computer Architecture',
                            'MICRO',
                            'IEEE/ACM International Symposium on Microarchitecture',
                            'ASPLOS',
                            'International Conference on Architectural Support for Programming Languages and Operating Systems',
                            'HPCA',
                            'IEEE International Symposium on High-Performance Computer Architecture'
                        ]
                    },
                    {
                        name: 'EDA Top Conferences',
                        items: [
                            'DAC',
                            'Design Automation Conference',
                            'ICCAD',
                            'International Conference on Computer-Aided Design'
                        ]
                    },
                    {
                        name: 'Computer Architecture Top 4',
                        items: [
                            'ISCA',
                            'International Symposium on Computer Architecture',
                            'MICRO',
                            'IEEE/ACM International Symposium on Microarchitecture',
                            'ASPLOS',
                            'International Conference on Architectural Support for Programming Languages and Operating Systems',
                            'HPCA',
                            'IEEE International Symposium on High-Performance Computer Architecture'
                        ]
                    },
                    {
                        name: 'Top Architecture Journals',
                        items: [
                            'IEEE Transactions on Computers',
                            'IEEE TC',
                            'ACM Transactions on Architecture and Code Optimization',
                            'ACM TACO'
                        ]
                    }
                ]
            };

        }

        getData() {
            return GM_getValue('publication_data', this.DEFAULT_DATA);
        }

        saveData(data) {
            GM_setValue('publication_data', data);
        }

        addCategory(categoryName) {
            const data = this.getData();
            if (!data.categories[categoryName]) {
                data.categories[categoryName] = [];
                this.saveData(data);
                return true;
            }
            return false;
        }

        updateCategory(oldName, newName) {
            const data = this.getData();
            if (newName && newName !== oldName && data.categories[oldName]) {
                data.categories[newName] = data.categories[oldName];
                delete data.categories[oldName];
                this.saveData(data);
                return true;
            }
            return false;
        }

        deleteCategory(categoryName) {
            const data = this.getData();
            if (data.categories[categoryName]) {
                delete data.categories[categoryName];
                this.saveData(data);
                return true;
            }
            return false;
        }

        addItem(category, itemName) {
            const data = this.getData();
            if (data.categories[category] && !data.categories[category].includes(itemName)) {
                data.categories[category].push(itemName);
                this.saveData(data);
                return true;
            }
            return false;
        }

        updateItem(category, oldName, newName) {
            const data = this.getData();
            if (newName && newName !== oldName && data.categories[category]) {
                const index = data.categories[category].indexOf(oldName);
                if (index !== -1) {
                    // 检查新名称是否已存在（可选）
                    if (data.categories[category].includes(newName)) {
                        return false; // 如果新名称已存在，返回false
                    }

                    data.categories[category][index] = newName;
                    this.saveData(data);
                    return true;
                }
            }
            return false;
        }

        deleteItem(category, itemName) {
            const data = this.getData();
            if (data.categories[category]) {
                data.categories[category] = data.categories[category].filter(i => i !== itemName);
                this.saveData(data);
                return true;
            }
            return false;
        }

        addGroup(groupName, items) {
            const data = this.getData();
            if (!data.groups) data.groups = [];
            data.groups.push({
                name: groupName,
                items: items
            });
            this.saveData(data);
            return true;
        }

        updateGroup(index, newName) {
            const data = this.getData();
            if (newName && data.groups[index] && data.groups[index].name != newName) {
                data.groups[index].name = newName;
                this.saveData(data);
                return true;
            }
            return false;
        }

        copyGroup(index, newName) {
            const data = this.getData();
            if (data.groups[index]) {
                data.groups.push({
                    name: newName,
                    items: [...data.groups[index].items]
                });
                this.saveData(data);
                return true;
            }
            return false;
        }

        deleteGroup(index) {
            const data = this.getData();
            if (data.groups[index]) {
                data.groups.splice(index, 1);
                this.saveData(data);
                return true;
            }
            return false;
        }
    }

    /**
     * 模态框基础组件
     */
    class Modal {
        constructor(title, content, buttons = []) {
            this.overlay = this.createOverlay();
            this.modal = this.createModal(title, content, buttons);
            this.overlay.appendChild(this.modal);
            document.body.appendChild(this.overlay);
        }

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            `;
            return overlay;
        }

        createModal(title, content, buttons) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            `;

            modal.innerHTML = `
                <h2 style="margin-top: 0; font-size: 18px; color: #333;">${title}</h2>
                <div class="modal-content">${content}</div>
                <div class="modal-footer" style="margin-top: 20px; text-align: right;"></div>
            `;

            const footer = modal.querySelector('.modal-footer');
            buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.textContent = button.label;
                btn.style.cssText = button.style || `
                    background-color: #f1f3f4;
                    color: #202124;
                    border: 1px solid #dadce0;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                `;
                btn.addEventListener('click', button.handler);
                footer.appendChild(btn);
            });

            return modal;
        }

        close() {
            document.body.removeChild(this.overlay);
        }
    }

    /**
     * 出版物UI组件
     */
    class PublicationUI {
        constructor(lang, fieldId, onSaveCallback) {
            this.lang = lang;
            this.fieldId = fieldId;
            this.onSaveCallback = onSaveCallback;
            this.pubManager = new PublicationManager();
            this.currentModal = null;
            this.eventHandlers = new Map(); // To track event handlers
        }

        createSelect() {
            const select = document.createElement('select');
            select.style.cssText = `
                width: 150px;
                padding: 5px;
                font-size: 12px;
                border: 1px solid #ddd;
                border-radius: 3px;
                background-color: white;
            `;

            if (!GM_getValue('publication_data')) {
                GM_setValue('publication_data', this.pubManager.DEFAULT_DATA);
            }

            this.refreshPublicationGroups(select);

            select.addEventListener('change', (e) => {
                const input = document.getElementById(this.fieldId);
                if (e.target.value === 'more') {
                    this.openMoreOptionsModal();
                } else if (e.target.value) {
                    input.value = e.target.value;
                }
                select.style.display = 'none';
            });

            return select;
        }

        refreshPublicationGroups(select) {
            const data = this.pubManager.getData();
            const groups = data.groups || [];

            select.innerHTML = `
                <option value="">${this.lang.selectDefault}</option>
                ${groups.map(group =>
                `<option value="${group.items.join(' OR ')}">${group.name}</option>`
            ).join('')}
                <option value="more">${this.lang.moreOptions}</option>
            `;
        }

        renderGroupsList(data) {
            return (data.groups || []).map((group, index) => `
                <li data-group-index="${index}" style="padding: 8px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${group.name}</div>
                        <div style="font-size: 12px; color: #666;">${group.items.join(', ')}</div>
                    </div>
                    <div>
                        <button class="btn-rename-group" data-index="${index}" style="background: #fbbc05; color: white; border: none; padding: 3px 6px; cursor: pointer; margin: 0 2px;">
                            ${this.lang.rename}
                        </button>
                        <button class="btn-copy-group" data-index="${index}" style="background: #4285f4; color: white; border: none; padding: 3px 6px; cursor: pointer; margin: 0 2px;">
                            ${this.lang.copy}
                        </button>
                        <button class="btn-delete-group" data-index="${index}" style="background: #ea4335; color: white; border: none; padding: 3px 6px; cursor: pointer;">
                            ${this.lang.delete}
                        </button>
                    </div>
                </li>
            `).join('');
        }

        openMoreOptionsModal() {
            const currentData = this.pubManager.getData();

            const modalContent = `
                <div style="display: flex; margin-bottom: 15px;">
                    <button id="btnApply" style="padding: 8px 15px; background: #34a853; color: white; border: none; cursor: pointer; margin-right: 5px;">
                        ${this.lang.applySelected}
                    </button>
                    <button id="btnSaveOrCreateGroup" style="padding: 8px 15px; background: #4285f4; color: white; border: none; cursor: pointer; margin-right: 5px;">
                        ${this.lang.saveOrCreateGroup}
                    </button>
                    <button id="btnManageCategories" style="padding: 8px 15px; background: #fbbc05; color: white; border: none; cursor: pointer;">
                        ${this.lang.manageCategories}
                    </button>
                </div>

                <div style="margin-bottom: 15px;">
                    <h3 style="font-size: 14px; margin-bottom: 5px;">${this.lang.selectPublications}</h3>
                    <div id="publicationCheckboxes" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                        ${this.renderAllCheckboxes(currentData)}
                    </div>
                </div>

                <div>
                    <h3 style="font-size: 14px; margin-bottom: 10px;">${this.lang.savedGroups}</h3>
                    <ul id="savedGroupsList" style="list-style: none; padding: 0; margin: 0; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">
                        ${this.renderGroupsList(currentData)}
                    </ul>
                </div>
            `;

            this.currentModal = new Modal(
                this.lang.publicationManagement,
                modalContent,
                [
                    {
                        label: this.lang.close,
                        handler: () => this.currentModal.close()
                    }
                ]
            );

            this.bindModalEvents();
        }

        renderAllCheckboxes(data) {
            return Object.entries(data.categories || {}).map(([category, items]) => {
                // Generate a unique ID for the category checkbox
                const categoryCheckboxId = `category-${category.replace(/\s+/g, '-').toLowerCase()}`;

                return `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="${categoryCheckboxId}" class="category-checkbox" data-category="${category}" style="margin-right: 8px;">
                            <h4 style="margin: 0; font-size: 13px; color: #555; flex-grow: 1;">
                                <label for="${categoryCheckboxId}" style="cursor: pointer;">${category}</label>
                            </h4>
                        </div>
                        <div style="margin-left: 20px;">
                            ${items.map(item => `
                                <div style="margin-bottom: 5px;">
                                    <label style="display: flex; align-items: center;">
                                        <input type="checkbox" value="${item}" class="pub-checkbox" data-category="${category}" style="margin-right: 8px;">
                                        <span>${item}</span>
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        openEditWindow() {
            const currentData = this.pubManager.getData();
            let title, content;

            title = this.lang.manageCategories;
            content = this.renderCategoryManagementContent(currentData);

            const editModal = new Modal(
                title,
                content,
                [
                    {
                        label: this.lang.close,
                        handler: () => {
                            editModal.close();
                            this.refreshAll();
                        }
                    }
                ]
            );

            this.bindEditWindowEvents(editModal);
        }

        renderCategoryManagementContent(data) {
            return `
                <div style="margin-bottom: 15px;">
                    <input type="text" id="newCategoryName" placeholder="${this.lang.newCategory}" style="padding: 5px; width: 200px; margin-right: 10px;">
                    <button id="btnAddCategory" style="padding: 5px 10px; background: #34a853; color: white; border: none; cursor: pointer;">
                        ${this.lang.add}
                    </button>
                </div>

                <div style="max-height: 500px; overflow-y: auto;">
                    ${Object.entries(data.categories || {}).map(([cat, items]) => `
                        <div style="margin-bottom: 15px; border: 1px solid #eee; border-radius: 4px; padding: 10px;">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <h3 style="margin: 0; flex-grow: 1;">${cat}</h3>
                                <button class="btn-edit-category" data-category="${cat}" style="background: #fbbc05; color: white; border: none; padding: 3px 8px; cursor: pointer; margin-right: 5px;">
                                    ${this.lang.edit}
                                </button>
                                <button class="btn-delete-category" data-category="${cat}" style="background: #ea4335; color: white; border: none; padding: 3px 8px; cursor: pointer;">
                                    ${this.lang.delete}
                                </button>
                            </div>

                            <div style="margin-left: 15px;">
                                ${items.map(item => `
                                    <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 5px 0;">
                                        <span style="flex-grow: 1;">${item}</span>
                                        <button class="btn-edit-item" data-category="${cat}" data-item="${item}" style="background: #fbbc05; color: white; border: none; padding: 2px 6px; cursor: pointer; margin-right: 5px; font-size: 12px;">
                                            ${this.lang.edit}
                                        </button>
                                        <button class="btn-delete-item" data-category="${cat}" data-item="${item}" style="background: #ea4335; color: white; border: none; padding: 2px 6px; cursor: pointer; font-size: 12px;">
                                            ${this.lang.delete}
                                        </button>
                                    </div>
                                `).join('')}

                                <div style="margin-top: 10px;">
                                    <input type="text" class="new-item-input" data-category="${cat}" placeholder="${this.lang.newItem}" style="padding: 5px; width: 200px; margin-right: 10px;">
                                    <button class="btn-add-item" data-category="${cat}" style="padding: 5px 10px; background: #34a853; color: white; border: none; cursor: pointer;">
                                        ${this.lang.add}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        bindEditWindowEvents(modal) {
            const modalElement = modal.modal;

            // Clear previous handlers
            this.clearEventHandlers(modalElement);

            // Add category
            const addCategoryHandler = () => {
                const categoryName = modalElement.querySelector('#newCategoryName').value.trim();
                if (this.pubManager.addCategory(categoryName)) {
                    this.refreshEditWindow(modal);
                    modalElement.querySelector('#newCategoryName').value = '';
                }
            };
            this.addEventHandler(modalElement, '#btnAddCategory', 'click', addCategoryHandler);

            // Event delegation for dynamic elements
            const clickHandler = (e) => {
                // Edit category
                if (e.target.classList.contains('btn-edit-category')) {
                    const oldName = e.target.dataset.category;
                    const newName = prompt(this.lang.enterNewName, oldName);
                    if (this.pubManager.updateCategory(oldName, newName)) {
                        this.refreshEditWindow(modal);
                    }
                    return;
                }

                // Delete category
                if (e.target.classList.contains('btn-delete-category')) {
                    if (confirm(this.lang.confirmDeleteCategory)) {
                        const category = e.target.dataset.category;
                        if (this.pubManager.deleteCategory(category)) {
                            this.refreshEditWindow(modal);
                        }
                    }
                    return;
                }

                // Add item
                if (e.target.classList.contains('btn-add-item')) {
                    const category = e.target.dataset.category;
                    const input = modalElement.querySelector(`.new-item-input[data-category="${category}"]`);
                    const itemName = input.value.trim();

                    if (this.pubManager.addItem(category, itemName)) {
                        this.refreshEditWindow(modal);
                        input.value = '';
                    }
                    return;
                }

                // Edit item
                if (e.target.classList.contains('btn-edit-item')) {
                    const category = e.target.dataset.category;
                    const oldName = e.target.dataset.item;
                    const newName = prompt(this.lang.enterNewName, oldName);

                    if (newName && newName !== oldName) {
                        if (this.pubManager.updateItem(category, oldName, newName)) {
                            this.refreshEditWindow(modal);
                        }
                    }
                    return;
                }

                // Delete item
                if (e.target.classList.contains('btn-delete-item')) {
                    if (confirm(this.lang.confirmDeleteItem)) {
                        const category = e.target.dataset.category;
                        const item = e.target.dataset.item;
                        if (this.pubManager.deleteItem(category, item)) {
                            this.refreshEditWindow(modal);
                        }
                    }
                    return;
                }
            };

            this.addEventHandler(modalElement, null, 'click', clickHandler);
        }

        bindModalEvents() {
            const modalElement = this.currentModal.modal;

            // Clear previous handlers
            this.clearEventHandlers(modalElement);

            // Static elements
            const manageCategoriesHandler = () => this.openEditWindow();
            this.addEventHandler(modalElement, '#btnManageCategories', 'click', manageCategoriesHandler);

            const saveGroupHandler = () => {
                const selectedItems = Array.from(modalElement.querySelectorAll('.pub-checkbox:checked')).map(cb => cb.value);
                if (selectedItems.length === 0) {
                    alert(this.lang.noItemsSelected);
                    return;
                }

                const groupName = prompt(this.lang.enterGroupName);
                if (!groupName) return;

                this.pubManager.addGroup(groupName, selectedItems);

                const input = document.getElementById(this.fieldId);
                if (input) {
                    input.value = selectedItems.join(' OR ');
                }

                this.refreshModalContent();

                if (this.onSaveCallback) {
                    this.onSaveCallback();
                }
            };
            this.addEventHandler(modalElement, '#btnSaveOrCreateGroup', 'click', saveGroupHandler);

            const applyHandler = () => {
                const selectedItems = Array.from(modalElement.querySelectorAll('.pub-checkbox:checked')).map(cb => cb.value);
                if (selectedItems.length > 0) {
                    const input = document.getElementById(this.fieldId);
                    input.value = selectedItems.join(' OR ');
                    this.currentModal.close();
                    if (this.onSaveCallback) this.onSaveCallback();
                }
            };
            this.addEventHandler(modalElement, '#btnApply', 'click', applyHandler);

            // Category checkbox handler
            const categoryCheckboxHandler = (e) => {
                if (e.target.classList.contains('category-checkbox')) {
                    const category = e.target.dataset.category;
                    const checkboxes = modalElement.querySelectorAll(`.pub-checkbox[data-category="${category}"]`);
                    const isChecked = e.target.checked;

                    checkboxes.forEach(checkbox => {
                        checkbox.checked = isChecked;
                    });

                    // Update the indeterminate state
                    e.target.indeterminate = false;
                }
            };
            this.addEventHandler(modalElement, null, 'change', categoryCheckboxHandler);

            // Item checkbox handler
            const itemCheckboxHandler = (e) => {
                if (e.target.classList.contains('pub-checkbox')) {
                    const category = e.target.dataset.category;
                    const categoryCheckbox = modalElement.querySelector(`.category-checkbox[data-category="${category}"]`);
                    const itemCheckboxes = modalElement.querySelectorAll(`.pub-checkbox[data-category="${category}"]`);

                    const checkedCount = Array.from(itemCheckboxes).filter(cb => cb.checked).length;
                    const totalCount = itemCheckboxes.length;

                    if (checkedCount === 0) {
                        categoryCheckbox.checked = false;
                        categoryCheckbox.indeterminate = false;
                    } else if (checkedCount === totalCount) {
                        categoryCheckbox.checked = true;
                        categoryCheckbox.indeterminate = false;
                    } else {
                        categoryCheckbox.checked = false;
                        categoryCheckbox.indeterminate = true;
                    }
                }
            };
            this.addEventHandler(modalElement, null, 'change', itemCheckboxHandler);

            // Event delegation for dynamic elements
            const clickHandler = (e) => {
                // Rename group
                if (e.target.classList.contains('btn-rename-group')) {
                    const index = parseInt(e.target.dataset.index);
                    const group = this.pubManager.getData().groups[index];
                    const newName = prompt(this.lang.enterNewName, group.name);
                    if (newName && newName !== group.name) {
                        this.pubManager.updateGroup(index, newName);
                        this.refreshModalContent();
                    }
                    return;
                }

                // Copy group
                if (e.target.classList.contains('btn-copy-group')) {
                    const index = parseInt(e.target.dataset.index);
                    const group = this.pubManager.getData().groups[index];
                    const newName = prompt(this.lang.enterNewName, `${group.name} (Copy)`);
                    if (newName) {
                        this.pubManager.copyGroup(index, newName);
                        this.refreshModalContent();
                    }
                    return;
                }

                // Delete group
                if (e.target.classList.contains('btn-delete-group')) {
                    if (confirm(this.lang.confirmDeleteGroup)) {
                        const index = parseInt(e.target.dataset.index);
                        this.pubManager.deleteGroup(index);
                        this.refreshModalContent();
                    }
                    return;
                }
            };

            this.addEventHandler(modalElement, null, 'click', clickHandler);
        }

        addEventHandler(element, selector, event, handler) {
            const actualHandler = selector
                ? (e) => {
                    const target = element.querySelector(selector);
                    if (e.target === target) handler(e);
                }
                : handler;

            element.addEventListener(event, actualHandler);
            this.eventHandlers.set({element, event, handler: actualHandler}, actualHandler);
        }

        clearEventHandlers(element) {
            for (const [key, handler] of this.eventHandlers) {
                if (key.element === element) {
                    key.element.removeEventListener(key.event, handler);
                    this.eventHandlers.delete(key);
                }
            }
        }

        refreshEditWindow(modal) {
            const currentData = this.pubManager.getData();
            if (modal && modal.modal) {
                const contentContainer = modal.modal.querySelector('.modal-content');
                if (contentContainer) {
                    // Save scroll position
                    const scrollTop = contentContainer.scrollTop;

                    // Re-render content
                    contentContainer.innerHTML = this.renderCategoryManagementContent(currentData);

                    // Restore scroll position
                    contentContainer.scrollTop = scrollTop;

                    // Rebind events
                    this.bindEditWindowEvents(modal);
                }
            }
        }

        refreshAll() {
            if (this.currentModal) {
                this.refreshModalContent();
            }
            if (this.onSaveCallback) {
                this.onSaveCallback();
            }
        }

        refreshModalContent() {
            const currentData = this.pubManager.getData();
            const modalElement = this.currentModal?.modal;

            if (modalElement) {
                // Save checkbox states
                const checkedItems = new Set(
                    Array.from(modalElement.querySelectorAll('.pub-checkbox:checked'))
                        .map(cb => cb.value)
                );

                // Re-render content
                modalElement.querySelector('#publicationCheckboxes').innerHTML =
                    this.renderAllCheckboxes(currentData);

                modalElement.querySelector('#savedGroupsList').innerHTML =
                    this.renderGroupsList(currentData);

                // Restore checkbox states
                modalElement.querySelectorAll('.pub-checkbox').forEach(cb => {
                    if (checkedItems.has(cb.value)) {
                        cb.checked = true;
                    }
                });

                // Update category checkboxes state
                currentData.categories && Object.keys(currentData.categories).forEach(category => {
                    const categoryCheckbox = modalElement.querySelector(`.category-checkbox[data-category="${category}"]`);
                    if (categoryCheckbox) {
                        const itemCheckboxes = modalElement.querySelectorAll(`.pub-checkbox[data-category="${category}"]`);
                        const checkedCount = Array.from(itemCheckboxes).filter(cb => cb.checked).length;
                        const totalCount = itemCheckboxes.length;

                        if (checkedCount === 0) {
                            categoryCheckbox.checked = false;
                            categoryCheckbox.indeterminate = false;
                        } else if (checkedCount === totalCount) {
                            categoryCheckbox.checked = true;
                            categoryCheckbox.indeterminate = false;
                        } else {
                            categoryCheckbox.checked = false;
                            categoryCheckbox.indeterminate = true;
                        }
                    }
                });

                // Rebind events
                this.bindModalEvents();
            }
        }
    }
// 在category左侧加复选框，其功能为选中和其下子item全选等价，若其下子item的选中状态会反过来影响该复选框。此外组列表中的组要求可以选中，每次只能选中一个，作出颜色区分，可以再次点击取消选中，并且选中某个保存的组可以直接将其所有的item直接体现在上面的item复选框中，取消选中保存的组后不影响item复选框。复用现在的保存创建组的按钮；选中组列表中的组后，保存创建组的按钮的点击可以使当前选择直接保存到该组；若未选中任何组则弹出新建组的提示框。
    /**
     * 通用选择组件
     */
    class FieldSelect {
        constructor(fieldId, lang) {
            this.fieldId = fieldId;
            this.lang = lang;
            this.selectElement = null; // 保存select元素的引用
        }

        createSelect() {
            this.selectElement = document.createElement('select');
            this.selectElement.style.cssText = `
                width: 150px;
                padding: 5px;
                font-size: 12px;
                border: 1px solid #ddd;
                border-radius: 3px;
                background-color: white;
            `;

            if (this.fieldId === 'publication') { // 注意这里修正了拼写错误
                this.setupPublicationSelect();
            } else {
                this.setupGenericSelect();
            }

            return this.selectElement;
        }

        setupPublicationSelect() {
            // 初始化存储数据
            if (!GM_getValue('publication_data')) {
                GM_setValue('publication_data', new PublicationManager().DEFAULT_DATA);
            }

            this.refreshPublicationGroups();

            this.selectElement.addEventListener('change', (e) => {
                const input = document.getElementById(this.fieldId);
                if (e.target.value === 'more') {
                    const pubUI = new PublicationUI(this.lang, this.fieldId, () => {
                        this.refreshPublicationGroups();
                    });
                    pubUI.openMoreOptionsModal();
                } else if (e.target.value) {
                    input.value = e.target.value;
                }
                this.selectElement.style.display = 'none';
            });
        }

        setupGenericSelect() {
            this.selectElement.innerHTML = `<option value="">${this.lang.selectDefault}</option>`;

            const storedValues = GM_getValue(`${this.fieldId}_defaults`, []);
            storedValues.forEach(value => {
                this.selectElement.innerHTML += `<option value="${value}">${value}</option>`;
            });

            this.selectElement.innerHTML += `<option value="add_new">${this.lang.addNew}</option>`;

            this.selectElement.addEventListener('change', (e) => {
                const input = document.getElementById(this.fieldId);
                if (e.target.value === 'add_new') {
                    const newValue = prompt(this.lang.enterNewValue);
                    if (newValue) {
                        input.value = newValue;
                        storedValues.push(newValue);
                        GM_setValue(`${this.fieldId}_defaults`, storedValues);
                        const newOption = new Option(newValue, newValue);
                        e.target.insertBefore(newOption, e.target.lastChild);
                        e.target.value = newValue;
                    } else {
                        e.target.value = '';
                    }
                } else {
                    input.value = e.target.value;
                }
                this.selectElement.style.display = 'none';
            });
        }

        refreshPublicationGroups() {
            if (!this.selectElement) return;

            const data = GM_getValue('publication_data', new PublicationManager().DEFAULT_DATA);
            const groups = data.groups || [];

            this.selectElement.innerHTML = `
                <option value="">${this.lang.selectDefault}</option>
                ${groups.map(group =>
                    `<option value="${group.items.join(' OR ')}">${group.name}</option>`
                ).join('')}
                <option value="more">${this.lang.moreOptions}</option>
            `;
        }
    }
    // 主函数
    function createSelectForField(fieldId, lang) {
        const fieldSelect = new FieldSelect(fieldId, lang);
        return fieldSelect.createSelect();
    }
    function createFieldContainer(field, lang, index) {
        const fieldContainer = document.createElement('div');
        fieldContainer.style.cssText = `
            margin-left: 10px;
            display: inline-flex;
            align-items: center;
            position: relative;
        `;

        const label = document.createElement('label');
        label.textContent = field.label;
        label.style.cssText = `
            margin-right: 5px;
            font-size: 12px;
            color: #666;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = field.id;
        input.style.cssText = `
            width: 120px;
            padding: 2px 5px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
        `;
        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }

        const select = createSelectForField(field.id, lang);
        select.style.cssText = `
            position: absolute;
            right: 0;
            top: 100%;
            width: 100%;
            font-size: 12px;
            z-index: 1100;
            display: none;
        `;

        input.addEventListener('focus', () => {
            select.style.display = 'block';
        });

        document.addEventListener('click', (e) => {
            if (!fieldContainer.contains(e.target)) {
                select.style.display = 'none';
            }
        });

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        fieldContainer.appendChild(select);

        if (index === 0) {
            const titleOnlyCheckbox = createTitleOnlyCheckbox(lang);
            titleOnlyCheckbox.style.marginLeft = '5px';
            fieldContainer.appendChild(titleOnlyCheckbox);
        }

        return fieldContainer;
    }


    function createTitleOnlyCheckbox(lang) {
        const titleOnlyLabel = document.createElement('label');
        titleOnlyLabel.style.cssText = `
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #666;
        `;

        const titleOnlyCheckbox = document.createElement('input');
        titleOnlyCheckbox.type = 'checkbox';
        titleOnlyCheckbox.id = 'title-only';
        titleOnlyCheckbox.style.marginRight = '3px';

        titleOnlyLabel.appendChild(titleOnlyCheckbox);
        titleOnlyLabel.appendChild(document.createTextNode(lang.titleOnly));

        return titleOnlyLabel;
    }

    function createApplyButton(lang) {
        const applyButton = document.createElement('button');
        applyButton.id = 'apply-button';
        applyButton.textContent = lang.apply;
        applyButton.style.cssText = `
            padding: 5px 10px;
            margin-left: 10px;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        applyButton.addEventListener('click', applyAdvancedSearch);
        return applyButton;
    }

    function createSettingsModal() {
        const lang = translations[config.language];
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        `;

        modal.innerHTML = `
        <h2 style="margin-top: 0; color: #1a73e8; font-size: 24px; margin-bottom: 20px;">${lang.settingsTitle}</h2>
        <div style="display: grid; gap: 20px;">
            <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 4px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">${lang.layoutOptions}</h3>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">${lang.columnLayout}</label>
                    <select id="columnLayout" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="1" ${config.columnLayout === 1 ? 'selected' : ''}>${lang.singleColumn}</option>
                        <option value="2" ${config.columnLayout === 2 ? 'selected' : ''}>${lang.twoColumns}</option>
                        <option value="3" ${config.columnLayout === 3 ? 'selected' : ''}>${lang.threeColumns}</option>
                    </select>
                </div>
            </div>
            <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 4px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">${lang.navigationOptions}</h3>
                <div>
                    <input type="checkbox" id="autoPaging" ${config.autoPagingEnabled ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="autoPaging" style="cursor: pointer;">${lang.enableAutoPaging}</label>
                </div>
                <div style="margin-top: 10px;">
                    <label style="display: block; margin-bottom: 5px;">Max Pages to Load:</label>
                    <input type="number" id="autoPagingMaxPages" value="${config.autoPagingMaxPages}" min="1" max="20" style="width: 100%; padding: 5px;">
                </div>
                <div style="margin-top: 10px;">
                    <label style="display: block; margin-bottom: 5px;">Max Items to Load:</label>
                    <input type="number" id="autoPagingMaxItems" value="${config.autoPagingMaxItems}" min="10" max="500" style="width: 100%; padding: 5px;">
                </div>
                <div style="margin-top: 10px;">
                    <input type="checkbox" id="singleResultRedirect" ${config.singleResultRedirect ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="singleResultRedirect" style="cursor: pointer;">${lang.autoRedirect}</label>
                </div>
            </div>
            <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 4px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">${lang.bibtexOptions}</h3>
                <div>
                    <input type="checkbox" id="bibtexCopy" ${config.bibtexCopyEnabled ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="bibtexCopy" style="cursor: pointer;">${lang.enableDirectBibtex}</label>
                </div>
                <div style="margin-top: 10px;">
                    <input type="checkbox" id="bibtexCopyAlert" ${config.bibtexCopyAlert ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="bibtexCopyAlert" style="cursor: pointer;">${lang.showBibtexAlert}</label>
                </div>
            </div>
            <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 4px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">${lang.additionalFeatures}</h3>
                <div>
                    <input type="checkbox" id="showFrequentScholars" ${config.showFrequentScholars ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="showFrequentScholars" style="cursor: pointer;">${lang.showFrequentScholars}</label>
                </div>
                <div style="margin-top: 10px;">
                    <input type="checkbox" id="showPublicationYearDistribution" ${config.showPublicationYearDistribution ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="showPublicationYearDistribution" style="cursor: pointer;">${lang.showPublicationYearDistribution}</label>
                </div>
            </div>
            <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 4px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">${lang.language}</h3>
                <div>
                    <input type="radio" name="language" id="langEn" value="en" ${config.language === 'en' ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="langEn" style="cursor: pointer;">English</label>
                </div>
                <div style="margin-top: 10px;">
                    <input type="radio" name="language" id="langZh" value="zh" ${config.language === 'zh' ? 'checked' : ''} style="margin-right: 10px;">
                    <label for="langZh" style="cursor: pointer;">中文</label>
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <button id="saveSettings" style="background-color: #1a73e8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">${lang.save}</button>
            <button id="closeSettings" style="background-color: #f1f3f4; color: #202124; border: 1px solid #dadce0; padding: 10px 20px; border-radius: 4px; cursor: pointer;">${lang.close}</button>
        </div>
    `;

        modalOverlay.appendChild(modal);
        return modalOverlay;
    }

    function openSettingsModal() {
        const modalOverlay = createSettingsModal();
        document.body.appendChild(modalOverlay);

        const closeModal = () => {
            document.body.removeChild(modalOverlay);
        };

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        const saveButton = document.getElementById('saveSettings');
        const closeButton = document.getElementById('closeSettings');

        saveButton.addEventListener('mouseover', () => {
            saveButton.style.backgroundColor = '#1967d2';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.backgroundColor = '#1a73e8';
        });

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#e8eaed';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#f1f3f4';
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            config.columnLayout = parseInt(document.getElementById('columnLayout').value);
            config.autoPagingEnabled = document.getElementById('autoPaging').checked;
            config.bibtexCopyEnabled = document.getElementById('bibtexCopy').checked;
            config.bibtexCopyAlert = document.getElementById('bibtexCopyAlert').checked;
            config.singleResultRedirect = document.getElementById('singleResultRedirect').checked;
            config.showFrequentScholars = document.getElementById('showFrequentScholars').checked;
            config.showPublicationYearDistribution = document.getElementById('showPublicationYearDistribution').checked;
            config.autoPagingMaxPages = parseInt(document.getElementById('autoPagingMaxPages').value);
            config.autoPagingMaxItems = parseInt(document.getElementById('autoPagingMaxItems').value);
            GM_setValue('columnLayout', config.columnLayout);
            GM_setValue('autoPagingEnabled', config.autoPagingEnabled);
            GM_setValue('bibtexCopyEnabled', config.bibtexCopyEnabled);
            GM_setValue('bibtexCopyAlert', config.bibtexCopyAlert);
            GM_setValue('singleResultRedirect', config.singleResultRedirect);
            GM_setValue('showFrequentScholars', config.showFrequentScholars);
            GM_setValue('showPublicationYearDistribution', config.showPublicationYearDistribution);
            GM_setValue('autoPagingMaxPages', config.autoPagingMaxPages);
            GM_setValue('autoPagingMaxItems', config.autoPagingMaxItems);
            addStyles();
            if (config.autoPagingEnabled) {
                initAutoPaging();
            }
            if (config.bibtexCopyEnabled) {
                initBibtexCopy();
            }
            if (config.showFrequentScholars) {
                showFrequentScholars();
            } else {
                removeFrequentScholars();
            }
            if (config.showPublicationYearDistribution) {
                showPublicationYearDistribution();
            } else {
                const distributionDiv = document.getElementById('publication-year-distribution');
                if (distributionDiv) {
                    distributionDiv.remove();
                }
            }
            const newLanguage = document.querySelector('input[name="language"]:checked').value;
            if (newLanguage !== config.language) {
                config.language = newLanguage;
                GM_setValue('language', config.language);
                updateUILanguage();
            }
            closeModal();
        });

        document.getElementById('closeSettings').addEventListener('click', closeModal);
    }

    function initAutoPaging() {
        const pager = {
            nextLink: '//a[./span[@class="gs_ico gs_ico_nav_next"]]',
            pageElement: '//div[@class="gs_r gs_or gs_scl"]',
            HT_insert: ["#gs_res_ccl_mid", 2],
            replaceE: '//div[@id="gs_n"]'
        };

        let curSite = {
            SiteTypeID: 4.1,
            pager: pager
        };

        const getElementByXpath = function (xpath, contextNode) {
            contextNode = contextNode || document;
            try {
                const result = document.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue && result.singleNodeValue.nodeType === 1 && result.singleNodeValue;
            } catch (err) {
                console.error(`Invalid xpath: ${xpath}`);
            }
        };

        const getAllElementsByXpath = function (xpath, contextNode) {
            contextNode = contextNode || document;
            const result = [];
            try {
                const query = document.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                for (let i = 0; i < query.snapshotLength; i++) {
                    const node = query.snapshotItem(i);
                    if (node.nodeType === 1) result.push(node);
                }
            } catch (err) {
                console.error(`Invalid xpath: ${xpath}`);
            }
            return result;
        };

        let loadedPages = 0;
        let loadedItems = 0;
        let isLoading = false;

        const handleScroll = function () {
            if (isLoading || loadedPages >= config.autoPagingMaxPages || loadedItems >= config.autoPagingMaxItems) {
                return;
            }

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const threshold = Math.min(500, clientHeight * 0.3);

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                isLoading = true;
                loadMoreResults().finally(() => {
                    isLoading = false;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        const loadMoreResults = async function () {
            // 添加限制检查
            //console.log("当前状态:", { loadedPages, loadedItems, autoPagingMaxPages: config.autoPagingMaxPages, autoPagingMaxItems: config.autoPagingMaxItems }); // 添加这行
            if (loadedPages >= config.autoPagingMaxPages || loadedItems >= config.autoPagingMaxItems) {
                console.log("已达到最大限制：", { loadedPages, loadedItems });
                return;
            }

            const nextLink = getElementByXpath(curSite.pager.nextLink);
            if (!nextLink) return;

            const pageElements = getAllElementsByXpath(curSite.pager.pageElement);
            if (pageElements.length === 0) return;

            const insertPoint = document.querySelector(curSite.pager.HT_insert[0]);
            if (!insertPoint) return;

            try {
                const response = await fetch(nextLink.href);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const newPageElements = getAllElementsByXpath(curSite.pager.pageElement, doc);

                newPageElements.forEach(elem => {
                    if (curSite.pager.HT_insert[1] === 2) {
                        insertPoint.appendChild(elem);
                    } else {
                        insertPoint.insertBefore(elem, insertPoint.firstChild);
                    }
                });

                if (config.showFrequentScholars) {
                    showFrequentScholars(); // Update frequent scholars after loading more results
                }
                showPublicationYearDistribution(); // Add this line to update year distribution

                const replaceE = getElementByXpath(curSite.pager.replaceE);
                if (replaceE) {
                    const newReplaceE = getElementByXpath(curSite.pager.replaceE, doc);
                    if (newReplaceE) {
                        replaceE.parentNode.replaceChild(newReplaceE, replaceE);
                    }
                }
                // 更新计数器
                loadedPages++;
                loadedItems += newPageElements.length;
                console.log("当前状态:", { loadedPages, loadedItems }); // 添加这行
            } catch (error) {
                console.error('Error loading more results:', error);
            }
        };

    }

    function initBibtexCopy() {
        document.addEventListener('click', function (event) {
            if (config.bibtexCopyEnabled && event.target.textContent.includes('BibTeX')) {
                event.preventDefault();
                event.stopPropagation();

                const bibtexLink = event.target.closest('a');
                if (!bibtexLink) return;

                const bibtexUrl = bibtexLink.href;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: bibtexUrl,
                    onload: function (response) {
                        if (response.status === 200) {
                            GM_setClipboard(response.responseText);
                            if (config.bibtexCopyAlert) {
                                alert('BibTeX copied to clipboard');
                            }
                        } else {
                            console.error('Failed to fetch BibTeX');
                            alert('Failed to copy BibTeX');
                        }
                    },
                    onerror: function (error) {
                        console.error('Error fetching BibTeX:', error);
                        alert('Error copying BibTeX');
                    }
                });
            }
        });
    }

    function redirectSingleResult() {
        if (!config.singleResultRedirect) return;
        const links = document.querySelectorAll('.gs_rt > a');
        if (links.length !== 1) return;
        if (sessionStorage.getItem(location.href) === null) {
            // Prevent redirection when back button is pressed
            sessionStorage.setItem(location.href, '1');
            links[0].click();
        }
    }

    function showFrequentScholars() {
        const scholarCounts = {};
        const scholarInfo = {};
        const results = document.querySelectorAll('.gs_r.gs_or.gs_scl');

        results.forEach(result => {
            const authors = result.querySelectorAll('.gs_a a');
            authors.forEach(author => {
                const name = author.textContent.trim();
                const link = author.href;
                if (link.includes('user=')) {
                    if (link in scholarCounts) {
                        scholarCounts[link]++;
                    } else {
                        scholarCounts[link] = 1;
                        scholarInfo[link] = { name, link };
                    }
                }
            });
        });

        const sortedScholars = Object.entries(scholarCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const lang = translations[config.language];
        const frequentScholarsDiv = document.createElement('div');
        frequentScholarsDiv.id = 'frequent-scholars';
        frequentScholarsDiv.style.cssText = `
            position: fixed;
            right: 20px;
            top: 200px;
            background-color: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 220px;
            z-index: 1100;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-size: 12px;
            line-height: 1.4;
        `;

        frequentScholarsDiv.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 14px;">${lang.showFrequentScholars}</h3>
            <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                ${sortedScholars.map(([link, count]) => `
                    <li style="margin-bottom: 8px;">
                        <a href="${link}" target="_blank" style="text-decoration: none; color: #1a0dab; display: inline-block; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${scholarInfo[link].name}</a>
                        <span style="color: #006621; font-size: 12px;"> (${count})</span>
                    </li>
                `).join('')}
            </ul>
        `;

        document.body.appendChild(frequentScholarsDiv);
    }

    function removeFrequentScholars() {
        const frequentScholarsDiv = document.getElementById('frequent-scholars');
        if (frequentScholarsDiv) {
            frequentScholarsDiv.remove();
        }
    }

    function applyAdvancedSearch() {
        const mainSearchInput = document.querySelector('input[name="q"]');
        if (!mainSearchInput) return;

        let query = '';

        const allWords = document.getElementById('all-words').value;
        const exactPhrase = document.getElementById('exact-phrase').value;
        const withoutWords = document.getElementById('without-words').value;
        const author = document.getElementById('author').value;
        const publication = document.getElementById('publication').value;
        const titleOnly = document.getElementById('title-only').checked;

        if (titleOnly) {
            query += 'allintitle:';
        }

        if (allWords) query += allWords + ' ';
        if (exactPhrase) query += `"${exactPhrase}" `;
        if (withoutWords) query += '-' + withoutWords.split(' ').join(' -') + ' ';
        if (author) query += `author:"${author}" `;
        if (publication) {
            // Handle multiple publications with OR
            const pubs = publication.split(' OR ').filter(p => p.trim());
            if (pubs.length > 0) {
                query += `source:(${pubs.map(p => `"${p}"`).join(' OR ')}) `;
            }
        }

        mainSearchInput.value = query.trim();


        // Store the current values in sessionStorage
        sessionStorage.setItem('gs_enhancer_all_words', allWords);
        sessionStorage.setItem('gs_enhancer_exact_phrase', exactPhrase);
        sessionStorage.setItem('gs_enhancer_without_words', withoutWords);
        sessionStorage.setItem('gs_enhancer_author', author);
        sessionStorage.setItem('gs_enhancer_publication', publication);
        sessionStorage.setItem('gs_enhancer_title_only', titleOnly);

        document.querySelector('button[type="submit"]').click();
    }

    function restoreAdvancedSearchValues() {
        document.getElementById('all-words').value = sessionStorage.getItem('gs_enhancer_all_words') || '';
        document.getElementById('exact-phrase').value = sessionStorage.getItem('gs_enhancer_exact_phrase') || '';
        document.getElementById('without-words').value = sessionStorage.getItem('gs_enhancer_without_words') || '';
        document.getElementById('author').value = sessionStorage.getItem('gs_enhancer_author') || '';
        document.getElementById('publication').value = sessionStorage.getItem('gs_enhancer_publication') || '';
        document.getElementById('title-only').checked = sessionStorage.getItem('gs_enhancer_title_only') === 'true';
    }

    function switchLanguage() {
        config.language = config.language === 'en' ? 'zh' : 'en';
        GM_setValue('language', config.language);
        updateUILanguage();
    }

    function updateUILanguage() {
        const lang = translations[config.language];
        document.getElementById('settings-button').textContent = lang.settings;

        const advancedSearchFields = [
            { id: 'all-words', labelKey: 'keywords', placeholderKey: 'allOfTheWords' },
            { id: 'exact-phrase', labelKey: 'exactPhrase' },
            { id: 'without-words', labelKey: 'without', placeholderKey: 'withoutWords' },
            { id: 'author', labelKey: 'author' },
            { id: 'publication', labelKey: 'publishedIn', placeholderKey: 'journalOrConference' }
        ];

        advancedSearchFields.forEach(field => {
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label) {
                label.textContent = lang[field.labelKey] + ':';
            }

            const input = document.getElementById(field.id);
            if (input) {
                if (field.placeholderKey) {
                    input.placeholder = lang[field.placeholderKey];
                }
                input.title = lang[field.labelKey]; // Add tooltip
            }
        });

        const titleOnlyLabel = document.querySelector('label[for="title-only"]');
        if (titleOnlyLabel) {
            titleOnlyLabel.lastChild.textContent = lang.titleOnly;
        }

        document.getElementById('apply-button').textContent = lang.apply;

        // Update frequent scholars title if it exists
        const frequentScholarsTitle = document.querySelector('#frequent-scholars h3');
        if (frequentScholarsTitle) {
            frequentScholarsTitle.textContent = lang.showFrequentScholars;
        }
    }

    function getPublicationYearDistribution() {
        const yearCounts = {};
        const results = document.querySelectorAll('.gs_r.gs_or.gs_scl');

        results.forEach(result => {
            const yearElement = result.querySelector('.gs_a');
            if (yearElement) {
                // Look for a year in the format YYYY, considering years from 1900 to 2099
                const yearMatch = yearElement.textContent.match(/\b(19|20)\d{2}\b/);
                if (yearMatch) {
                    const year = yearMatch[0];
                    yearCounts[year] = (yearCounts[year] || 0) + 1;
                } else {
                    // If no year found, count it as "Unknown"
                    yearCounts['Unknown'] = (yearCounts['Unknown'] || 0) + 1;
                }
            }
        });

        return yearCounts;
    }

    function showPublicationYearDistribution() {
        const existingDistribution = document.getElementById('publication-year-distribution');
        if (existingDistribution) {
            existingDistribution.remove();
        }

        if (!config.showPublicationYearDistribution) {
            return;
        }

        const yearCounts = getPublicationYearDistribution();
        let years = Object.keys(yearCounts).sort((a, b) => {
            if (a === 'Unknown') return 1;
            if (b === 'Unknown') return -1;
            return b - a;
        });

        // Group years before 1990 into a single category
        const oldYearsCount = years.filter(year => year !== 'Unknown' && parseInt(year) < 1990)
            .reduce((sum, year) => sum + yearCounts[year], 0);
        if (oldYearsCount > 0) {
            yearCounts['<1990'] = oldYearsCount;
            years = years.filter(year => year === 'Unknown' || parseInt(year) >= 1990);
            years.unshift('<1990');
        }

        // Limit to the most recent 15 years/categories (including Unknown if present)
        if (years.length > 15) {
            const unknownIndex = years.indexOf('Unknown');
            if (unknownIndex !== -1 && unknownIndex >= 15) {
                years = years.slice(0, 14).concat('Unknown');
            } else {
                years = years.slice(0, 15);
            }
        }

        const distributionDiv = document.createElement('div');
        distributionDiv.id = 'publication-year-distribution';
        distributionDiv.style.cssText = `
            position: fixed;
            right: 20px;
            top: 200px;
            background-color: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 220px;
            z-index: 1100;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-size: 12px;
            line-height: 1.4;
        `;

        const lang = translations[config.language];
        distributionDiv.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 14px;">${lang.publicationYearDistribution}</h3>
            <div id="year-histogram"></div>
        `;

        const histogramDiv = distributionDiv.querySelector('#year-histogram');
        const maxCount = Math.max(...years.map(year => yearCounts[year]));

        years.forEach(year => {
            const count = yearCounts[year];
            const percentage = (count / maxCount) * 100;

            const yearBar = document.createElement('div');
            yearBar.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            `;
            yearBar.innerHTML = `
                <span style="width: 45px; text-align: right; margin-right: 5px; font-size: 11px;">${year}</span>
                <div style="flex-grow: 1; height: 10px; background-color: #e0e0e0; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${percentage}%; background-color: #4285f4;"></div>
                </div>
                <span style="width: 30px; text-align: right; margin-left: 5px; font-size: 11px;">${count}</span>
            `;

            histogramDiv.appendChild(yearBar);
        });

        const frequentScholarsDiv = document.getElementById('frequent-scholars');
        if (frequentScholarsDiv) {
            const frequentScholarsRect = frequentScholarsDiv.getBoundingClientRect();
            distributionDiv.style.top = `${frequentScholarsRect.bottom + 10}px`;
        }

        document.body.appendChild(distributionDiv);
    }

    function init() {
        if (document.querySelector('#gs_top')) {
            addStyles();
            createSettingsButton();
            updateUILanguage();
            restoreAdvancedSearchValues();
            if (config.autoPagingEnabled) {
                initAutoPaging();
            }
            initBibtexCopy();
            redirectSingleResult();
            if (config.showFrequentScholars) {
                showFrequentScholars();
            }
            if (config.showPublicationYearDistribution) {
                showPublicationYearDistribution();
            }
        }
    }

    // Run the script
    init();
})();