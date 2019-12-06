/*
w = wall
m = monster
f = flame thrower gun
b = stair binary
r = stair ram
1 = key 1, multiple choice game
2 = key 2, quick math game
3 = key 3, escape the maze
e = energy
n = sniper
s = shock trap
= = crush trap
c = collectible item
g = gound
*/

var tileMap = [
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "w                                                                                                         w",
  "w                                              wwwwwwww                    w                              w",
  "w                      wwww                    w      w                                           b       w",
  "w                      w                              w                   w w             w      w        w",
  "w                      wfe  w                                  m         rrrr               ww   w        w",
  "w                      www                     w      =      wwwwwwwww       w   m e     w       w        w",
  "w                                              wwwwwwwwwwww                   sssssss            w        w",
  "w                                       b                                 wwwwwwwwwwww                2   w",
  "w                  b   w    w                                             w       =====   ccc   www  rr   w",
  "w                      w    w  r            b                wwwwww       w v     wwwwwwwwwwww            w",
  "w                  b   wcn       r  m  s    b   bbbbb                           w    www                  w",
  "w   m m                wwww    m r wwwwww            b                       ww    m m m m m m ssssssssss w",
  "w                  b       r                            r rrrrr                  w      wwwwwwwwwwwwwwwwwww",
  "w   w   w   wwwwwww          r                                            w                               w",
  "w   w   w                r    r               wwww                                                        w",
  "w   w   w                  bb                                              w           rrrrr          rr  w",
  "w   w   w                     w                              m          w                                 w",
  "w   w   w               w  r                               wwwww                                          w",
  "w   w k w                       w                                    w                  m      f       m  w",
  "w   wwwww             w ww     w                                  bbb               wwwwwwwwwwwwwwwwwwwwwww",
  "w                                 w                                                                       w",
  "w    rr             w      ww        w                                r             wwwwwwww     wwwwwwwwww",
  "w                                 w                    m       r                                          w",
  "w    rr               w   bbbb                      bbbbbbbbbbbbbbbbbbbb                    sssss         w",
  "w                               w                                                           bbbbb         w",
  "w    rr                 ww  w                     r                                                       w",
  "w                                                                                                         w",
  "w    rr                    rr                   r                                                         w",
  "w                                    1                                                                    w",
  "w   w   w     wwwwwwwwwwwwweewwwwwwwwwwwwwwwww                                  wwwwwwwwwwwwwwwwwwwwwwwwwww",
  "w   w   w     w                              wb                                         m               c w",
  "w   w R w     w            bb                w b                                wwwwwwwwwwwwwwwwwwwwwwwwwww",
  "w   w E wbbbbbw                              w                                                            w",
  "w   w G    m                                 w    b                                                       w",
  "w   w I wbbbbbw                              w     b                                                      w",
  "w   w S        r                             w     w                                                      w",
  "w   w T w     w r                            w     =e w  w          ccccccccc                             w",
  "w   w E          r                           w   wwwwww  cc         wwwwwwwww         rrrrrrrrrrrrrrrrrrrrw",
  "w   w s w  s  w   bbb                        w           wwww                           == ss == cccccccccw",
  "w   w                                        w           ccccc                  rrrrrrrrrrrrrrrrrrrrrrrrrrw",
  "w   w   w  ss w                              w           wwwwww                                           w",
  "w   w      ss                                w           cccccccc                                         w",
  "w   w   w     w             cccc             w           wwwwwwww                                         w",
  "w   w                       rrrr             w           cccccccccc                                       w",
  "w   w    wwwwww                              w           wwwwwwwwww                                       w",
  "w   w         w             rrrr             w                                                            w",
  "w   w    w    w                              w           wwwwwwwwwww                                      w",
  "w   w         w       rrrrr                  w           ccccssccccc                                      w",
  "w   w    w    w                                          wwwwwwwwwww                                      w",
  "w   w         w                                          ccccccccccc                                      w",
  "w   wwwww     wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwrrrrrrrrrrrwwwwwwwwwww                                      w",
  "w                                                        cc==ccccccc                                      w",
  "w                                      e                 wwwwwwwwwww                                      w",
  "w                                      bb                                    rrrrrrrrrrrrrrrrr            w",
  "w                                                                       #           =      err            w",
  "w                                     m                  wwwwwwwwwwwwrrrrrrrrrrrrrrrrrrrrrrrrr            w",
  "w                                     bb                 wwwwwwwwwww         r                  rr        w",
  "w                                 bb                     wwwwwwwwww          r                            w",
  "w                                                        wwwwwwwww           r                  rrr       w",
  "w                             bb                         wwwwwwww            r                       r    w",
  "w                         bb                             wwwwwww             r      ccccccccccccccc    cccw",
  "w                     bb                                 wwwwww              r      ccccccccccccccc rr cccw",
  "w                                                        wwwww               r      ccccccccccccccc    cccw",
  "w        m   m   m  m                 #                  wwww                r      rrrrrrrrrrrrrrrrrrrrrrw",
  "w      bbbbbbbbbbbbbb                3p                  www                 r                            w",
  "w          cc      bb                bb                  ww                  r   rr                       w",
  "w          bb      bb                                                        r      ccc                   w",
  "w           ec     bb                                                        r      rrr                   w",
  "w           bb     bb                                                        r           rr               w",
  "w           cc     bb                                                        r      r                     w",
  "w          bbb     bb                                                        r          rrrrr             w",
  "w              m   bb                                                        r          =====             w",
  "w      bbbbbbbbbbbbbb                                                        r      r   rrrrr             w",
  "w                                                                            r cc          m              w",
  "w   bbbbbb               cc f n cc   m     c  c  c                           rrrrr    rrrrrrr             w",
  "w         ccccccccc     bbbbbbbbbbbbbb     b  b  b                                 r                      w",
  "w         bbbbbbbbb                                                              r                        w",
  "w                                                                    b  b  rrrrr                          w",
  "w                   b    bbb                                     b                                        w",
  "w                 cc                                         b       b                                    w",
  "w                bbb   c                                 b                                                w",
  "w                      bbb                                            b                                   w",
  "w                           c                        b       m                                            w",
  "w                           b                        c                   b                                w",
  "w                               ec                   b                                                    w",
  "w                              bbbb                    ALU                bb                              w",
  "w                                                    bCONTROL  b          cc                              w",
  "w                           b                ccc                          bb                    e         w",
  "w                   c   w  c c   m   c  c  c         b                                         bb         w",
  "w                c  w    bbbbbbbbbb  w  w  w  wwww           m b  b  bb   bb              cc              w",
  "w                w       bbbbbbbbbb                  bbbbbbbbbbb                          bb              w",
  "w        w    f    n                      w                                                               w",
  "w       ww    w   wwww                                                                 bb       cc    cc  w",
  "w  c   wwww  mw     =                     w                 m                   #               cc    cc  w",
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
];
