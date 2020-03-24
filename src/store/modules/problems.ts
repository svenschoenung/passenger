import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PasswordsModule, KeysModule } from '@/store'
import { PasswordNode, PasswordFolder } from '@/model/passwords'
import { findMatchingPublicKeys, findMissingPublicKeys } from '@/service/gpg'

export type ProblemType = 'error' | 'warning'

export interface Problem {
    id: string,
    type: ProblemType,
    msg: string,
    node?: PasswordNode
}

export interface ProblemsState {
}

@Module({ name: 'problems', namespaced: true })
export default class ProblemsVuexModule extends VuexModule implements ProblemsState {

    get unknownKeyProblems(): Problem[] {
        return (PasswordsModule.list.value || [])
            .filter(item => item.annotations.notEncryptable && item.folder)
            .map(folder => {
                const keys = (folder as PasswordFolder).keys
                const missingKeys = findMissingPublicKeys(keys, KeysModule.publicKeys.value!)
                  .map(key => key.keyid)
                return {
                    id: `unknownKey_${folder.relPath}`,
                    type: 'error',
                    msg: `Unknown public key${missingKeys.length > 1 ? 's': ''}: ${missingKeys.join(', ')}`,
                    node: folder 
                }
            })
    }

    get problems() {
        return this.unknownKeyProblems
    }

    get errorCount() {
        return count(this.problems, 'error')
    }

    get warningCount() {
        return count(this.problems, 'warning')
    }
}

function count(problems: Problem[], type: ProblemType) {
    return problems.filter(problem => problem.type === type).length
}
