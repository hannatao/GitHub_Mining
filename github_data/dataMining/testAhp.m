A=[1,2,3,4,5,6,7;%%stars,forks,subs,cons,prs,issuess,networks
    1/2,1,2,2,3,5/2,3;
    1/3,1/2,1,2,3,4,4;
    1/4,1/2,1/2,1,3/2,3,3;
    1/5,1/3,1/3,2/3,1,2,3;
    1/6,2/5,1/4,1/3,1/2,1,2;
    1/7,1/3,1/4,1/3,1/3,1/2,1];
[V,D] = eig(A);
W=zeros(7,1);
CR=(D(1,1)-7)/6*1.32;
total=0;
for i=1:7
   total = V(i,1)+total;
end
for i=1:7
    W(i,1)=real(V(i,1))/total;
end
W

