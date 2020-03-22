import { ionIosFolder } from "@quasar/extras/ionicons-v4"
import { ionIosFolderOpen } from "@quasar/extras/ionicons-v4"
import { ionIosConstruct } from "@quasar/extras/ionicons-v4"
import { ionIosLock } from '@quasar/extras/ionicons-v4'
import { ionIosUnlock } from '@quasar/extras/ionicons-v4'
import { ionIosKey } from '@quasar/extras/ionicons-v4'
import { ionIosGitCompare } from '@quasar/extras/ionicons-v4'
import { ionIosClose } from '@quasar/extras/ionicons-v4'
import { ionIosWarning } from '@quasar/extras/ionicons-v4'
import { ionIosArrowDown } from '@quasar/extras/ionicons-v4'
import { ionIosArrowForward } from '@quasar/extras/ionicons-v4'
import { ionIosCloseCircleOutline } from '@quasar/extras/ionicons-v4'
import { ionIosList } from '@quasar/extras/ionicons-v4'
import { ionIosEye } from '@quasar/extras/ionicons-v4'
import { ionIosEyeOff } from '@quasar/extras/ionicons-v4'
import { ionIosSquareOutline } from '@quasar/extras/ionicons-v4'
import { ionIosAdd } from '@quasar/extras/ionicons-v4'
import { ionIosMail } from '@quasar/extras/ionicons-v4'
import { ionIosOpen } from '@quasar/extras/ionicons-v4'
import { ionIosSend } from '@quasar/extras/ionicons-v4'
import { ionIosRefresh } from '@quasar/extras/ionicons-v4'
import { ionMdPerson } from '@quasar/extras/ionicons-v4'
import { ionMdGlobe } from '@quasar/extras/ionicons-v4'
import { ionMdClipboard } from '@quasar/extras/ionicons-v4'
import { ionEllipsisVertical } from '@/ui/ionicons-v5'
import { ionSwapHorizontal } from '@/ui/ionicons-v5'
import { ionServerOutline } from '@/ui/ionicons-v5'
import { customTreeView } from '@/ui/custom-icons';

const icons = {
    folder: ionIosFolder,
    folderOpen: ionIosFolderOpen,
    password: ionIosLock,
    passwordOpen: ionIosUnlock,
    passwords: ionIosLock,
    settings: ionIosConstruct,
    key: ionIosKey,
    keys: ionIosKey,
    repo: ionIosGitCompare,
    repoPath: ionServerOutline,
    clear: ionIosClose,
    menu: ionEllipsisVertical,
    separator: ionIosArrowForward,
    unexpanded: ionIosArrowForward,
    expanded: ionIosArrowDown,
    error: ionIosCloseCircleOutline,
    errors: ionIosCloseCircleOutline,
    warning: ionIosWarning,
    warnings: ionIosWarning,
    problems: ionIosCloseCircleOutline,
    missing: ionIosClose,
    keyValue: ionIosList,
    text: ionIosSquareOutline,
    showPassword: ionIosEye,
    hidePassword: ionIosEyeOff,
    add: ionIosAdd,
    email: ionIosMail,
    user: ionMdPerson,
    url: ionMdGlobe,
    delete: ionIosClose,
    openUrl: ionIosOpen,
    sendEmail: ionIosSend,
    linkWithEditor: ionSwapHorizontal,
    list: ionIosList,
    tree: customTreeView,
    refresh: ionIosRefresh,
    clipboard: ionMdClipboard
}

export default icons