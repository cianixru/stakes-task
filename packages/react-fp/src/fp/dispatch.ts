type Action = {
    type: string
}


export type Dispatch<T> = {
    (action: T)
}

/*

type A = {
   d:7,
  s:'s'
}
/*
type Acts = {
    [K in keyof typeof a]: typeof a[K]
}
*//*
type Vars = keyof A

type Acts =  A[Vars]

var b:Acts;


const f:Dispatch<Acts>  = x => x
f(true)*/