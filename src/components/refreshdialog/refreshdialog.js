import dom from '../../scripts/dom';
import dialogHelper from '../dialogHelper/dialogHelper';
import loading from '../loading/loading';
import layoutManager from '../layoutManager';
import globalize from '../../scripts/globalize';
import '../../elements/emby-input/emby-input';
import '../../elements/emby-button/emby-button';
import '../../elements/emby-button/paper-icon-button-light';
import '../../elements/emby-checkbox/emby-checkbox';
import '../../elements/emby-select/emby-select';
import 'material-design-icons-iconfont';
import '../formdialog.scss';
import ServerConnections from '../ServerConnections';
import toast from '../toast/toast';

/*eslint prefer-const: "error"*/

function getEditorHtml() {
    let html = '';

    html += '<div class="formDialogContent smoothScrollY" style="padding-top:2em;">';
    html += '<div class="dialogContentInner dialog-content-centered">';
    html += '<form style="margin:auto;">';

    html += '<div class="fldSelectPlaylist selectContainer">';
    html += '<select is="emby-select" id="selectMetadataRefreshMode" label="' + globalize.translate('LabelRefreshMode') + '">';
    html += '<option value="scan" selected>' + globalize.translate('ScanForNewAndUpdatedFiles') + '</option>';
    html += '<option value="missing">' + globalize.translate('SearchForMissingMetadata') + '</option>';
    html += '<option value="all">' + globalize.translate('ReplaceAllMetadata') + '</option>';
    html += '</select>';
    html += '</div>';

    html += '<label class="checkboxContainer hide fldReplaceExistingImages">';
    html += '<input type="checkbox" is="emby-checkbox" class="chkReplaceImages" />';
    html += '<span>' + globalize.translate('ReplaceExistingImages') + '</span>';
    html += '</label>';

    html += '<div class="fieldDescription">';
    html += globalize.translate('RefreshDialogHelp');
    html += '</div>';
    html += '<hr/>';
    html += '<div class="quick_click" data-value="all" style="width:100%;height:50px;background: #00a4dc;color: #fff;display: flex;justify-content: center;align-items: center;">' + globalize.translate('ReplaceAllMetadata') + '</div>';

    html += '<input type="hidden" class="fldSelectedItemIds" />';

    html += '<br />';
    html += '<div class="formDialogFooter">';
    html += '<button is="emby-button" type="submit" class="raised btnSubmit block formDialogFooterItem button-submit">' + globalize.translate('Refresh') + '</button>';
    html += '</div>';

    html += '</form>';
    html += '</div>';
    html += '</div>';

    return html;
}

function centerFocus(elem, horiz, on) {
    import('../../scripts/scrollHelper').then((scrollHelper) => {
        const fn = on ? 'on' : 'off';
        scrollHelper.centerFocus[fn](elem, horiz);
    });
}

function onSubmit(e) {
    loading.show();

    const instance = this;
    const dlg = dom.parentWithClass(e.target, 'dialog');
    const options = instance.options;

    const apiClient = ServerConnections.getApiClient(options.serverId);

    const replaceAllMetadata = dlg.querySelector('#selectMetadataRefreshMode').value === 'all';

    const mode = dlg.querySelector('#selectMetadataRefreshMode').value === 'scan' ? 'Default' : 'FullRefresh';
    const replaceAllImages = mode === 'FullRefresh' && dlg.querySelector('.chkReplaceImages').checked;

    options.itemIds.forEach(function (itemId) {
        apiClient.refreshItem(itemId, {

            Recursive: true,
            ImageRefreshMode: mode,
            MetadataRefreshMode: mode,
            ReplaceAllImages: replaceAllImages,
            ReplaceAllMetadata: replaceAllMetadata
        });
    });

    dialogHelper.close(dlg);

    toast(globalize.translate('RefreshQueued'));

    loading.hide();

    e.preventDefault();
    return false;
}

class RefreshDialog {
    constructor(options) {
        this.options = options;
    }

    show() {
        const dialogOptions = {
            removeOnClose: true,
            scrollY: false
        };

        if (layoutManager.tv) {
            dialogOptions.size = 'fullscreen';
        } else {
            dialogOptions.size = 'small';
        }

        const dlg = dialogHelper.createDialog(dialogOptions);

        dlg.classList.add('formDialog');

        let html = '';
        const title = globalize.translate('RefreshMetadata');

        html += '<div class="formDialogHeader">';
        html += `<button is="paper-icon-button-light" class="btnCancel autoSize" tabindex="-1" title="${globalize.translate('ButtonBack')}"><span class="material-icons arrow_back" aria-hidden="true"></span></button>`;
        html += '<h3 class="formDialogHeaderTitle">';
        html += title;
        html += '</h3>';

        html += '</div>';

        html += getEditorHtml();

        dlg.innerHTML = html;

        dlg.querySelector('form').addEventListener('submit', onSubmit.bind(this));
        dlg.addEventListener('click', function(e) {
            if (e.target.className === 'quick_click') {
                dlg.querySelector('#selectMetadataRefreshMode').value = e.target.dataset.value;
                dlg.querySelector('.btnSubmit').click();
            }
        });

        dlg.querySelector('#selectMetadataRefreshMode').addEventListener('change', function () {
            if (this.value === 'scan') {
                dlg.querySelector('.fldReplaceExistingImages').classList.add('hide');
            } else {
                dlg.querySelector('.fldReplaceExistingImages').classList.remove('hide');
            }
        });

        if (this.options.mode) {
            dlg.querySelector('#selectMetadataRefreshMode').value = this.options.mode;
        }

        dlg.querySelector('#selectMetadataRefreshMode').dispatchEvent(new CustomEvent('change'));

        dlg.querySelector('.btnCancel').addEventListener('click', function () {
            dialogHelper.close(dlg);
        });

        if (layoutManager.tv) {
            centerFocus(dlg.querySelector('.formDialogContent'), false, true);
        }

        return new Promise(function (resolve) {
            if (layoutManager.tv) {
                centerFocus(dlg.querySelector('.formDialogContent'), false, false);
            }

            dlg.addEventListener('close', resolve);
            dialogHelper.open(dlg);
        });
    }
}

export default RefreshDialog;
