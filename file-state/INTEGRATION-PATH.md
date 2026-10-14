# Integration path file

> Canonical shape of a project's integration path declaration. `PROCESS.md`
> §Evidence and completion defines what each path delivers and what completion
> checks on it. The declaration is a tracked project file at
> `process/integration-path.md`, versioned in the repository and changed the
> way the project reviews any other repository change, in a store-backed and a
> file-backed repository alike. It is not a store record, and no tool writes
> it: a person declares the path in a reviewed commit.

```markdown
# Integration path

<optional prose: how this project delivers, and why>

- **Integration path:** merge | deploy
```

## Value

- **Integration path** is `merge` or `deploy`, case-insensitive. `merge`
  delivers by merging to the remote default branch; `deploy` delivers by
  deploying a named commit.
- Only the first `- **Integration path:**` bullet counts; later ones and the
  prose around it are ignored.
- A project without the file delivers by `merge`.

## Refusals

A file that exists is refused, naming the file and both accepted values, when
its first `- **Integration path:**` bullet carries any other value or none, or
when it has no such bullet.
