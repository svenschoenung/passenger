import { ionIosFolder } from "@quasar/extras/ionicons-v4"
import { ionIosFolderOpen } from "@quasar/extras/ionicons-v4"
import { ionIosConstruct } from "@quasar/extras/ionicons-v4"
import { ionIosLock } from '@quasar/extras/ionicons-v4'
import { ionIosKey } from '@quasar/extras/ionicons-v4'
import { ionIosGitCompare } from '@quasar/extras/ionicons-v4'
import { ionIosClose } from '@quasar/extras/ionicons-v4'
import { ionIosWarning } from '@quasar/extras/ionicons-v4'
import { ionIosArrowDown } from '@quasar/extras/ionicons-v4'
import { ionIosArrowForward } from '@quasar/extras/ionicons-v4'
import { ionIosCloseCircleOutline } from '@quasar/extras/ionicons-v4'
import { ionIosArchive } from '@quasar/extras/ionicons-v4'
import { ionEllipsisVertical } from '@/ui/ionicons-v5'

const icons = {
    folder: ionIosFolder,
    folderOpen: ionIosFolderOpen,
    password: ionIosLock,
    passwords: ionIosLock,
    config: ionIosConstruct,
    key: ionIosKey,
    keys: ionIosKey,
    repo: ionIosGitCompare,
    repoPath: ionIosArchive,
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
}

export default icons