# Updating without losing your work

Exercise directories use stable site/module/lesson/language/difficulty paths.
`exercise.json` records the website ticket ID, content revision and original
starter hashes. `workspace.json` lists the exact included exercises.

Keep your work committed before bringing in a newer workspace version. Compare
the revisions and review changes to files you edited; keep your own commits and
notes when resolving conflicts. A template-generated repository does not pull
future template updates automatically. You can add the owner's repository as a
Git remote and merge selected changes, or compare a fresh download in a separate
directory. Never extract a new download directly over uncommitted work.

The maintainer exporter creates a new directory and refuses an existing one.
It is not a learner update or synchronization command. It does not inspect your
Git history, merge changes or reset files.

For a change to the task's meaning, use the new recorded content revision and
read its instructions before carrying an earlier attempt forward. A local pass
on an old sample does not establish acceptance for a newer website ticket.
