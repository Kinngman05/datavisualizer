#!/usr/bin/python3
import mysqlQueryBuilder

def func1():
    # x = mysqlQueryBuilder.queryBuilder("CREATE",**{"what":"TABLE","object":"test_table","table_constrains":{"id":"INT NOT NULL","parent_id":"INT NOT NULL"},"index_constrains":None,"primary_key":"id","foreign_key":[{"constraint_name": None,"foreign_table_name": "parent","child_attribute": ["parent_id"],"parent_attribute": ["id"],"on_update":None,"on_delete":"CASCADE"}],"initial_data":None})
    # x=mysqlQueryBuilder.queryBuilder("CREATE",**{"what":"DATABASE","object":"test_db"})
    # x=mysqlQueryBuilder.queryBuilder("CREATE",**{"what":"PROCEDURE","object":"test_proc","parameters":["IN _id CHAR(10)","OUT _what VARCHAR(20)"],"queries":["UPDATE students SET login_status=TRUE WHERE id=_id;"]})
    # x=mysqlQueryBuilder.queryBuilder("CREATE",**{"what":"TRIGGER","object":"test_trigger","time":"BEFORE","event":"UPDATE","database_name":"test_db","table_name":"attendance","each":"FOR EACH ROW","queries":["IF OLD.time_spent IS NULL THEN SET NEW.time_spent=TIMEDIFF(NEW.time_out,OLD.time_in); END IF;","CALL set_login_status_to_False(NEW.id);"]})
    # x=mysqlQueryBuilder.queryBuilder("USE","test_db")
    # x=mysqlQueryBuilder.queryBuilder("INSERT","table_name",**{"name":"blah","id":"bleh","login_status":"bleu"})
    # x=mysqlQueryBuilder.queryBuilder("SELECT",**{"attributes":["*","id*10","id/10","id+10","id-10"],"from":["testing"],"where":{"name":"trun","id":"10","phno":"NOT NULL"},"group_by":[],"having":{},"order_by":[],"limit":5})
    # x=mysqlQueryBuilder.queryBuilder("SELECT",**{"attributes":["SUM(id)"],"from":["testing"],"where":{"name":"trun","id":"10","phno":"NULL"},"group_by":["id"],"having":{},"order_by":[],"offset":10,"limit":5})
    # x=mysqlQueryBuilder.queryBuilder("SELECT",**{"attributes":["id","SUM(id)"],"object":["testing"],"where":{},"group_by":["id"],"having":{},"order_by":["id","name DESC"],"offset":10,"limit":5})
    # x=mysqlQueryBuilder.queryBuilder("DROP","DATABASE","test_db")
    x=mysqlQueryBuilder.queryBuilder("DELETE",**{"name":"test_table","where":{"id":10,"name":"trun"},"having":{}})
    query=x.buildQuery()
    print("The query is:",query)

def func2(x):
    # print("input x is:",x)
    z=[]
    for y in x:
        z.append(y[0] if len(y)==1 else ",".join(y))
    # print("z",z)
    z=list(map(lambda a: "INDEX("+a+")",z))
    # print("z",z)

if __name__ == "__main__":
    # y=[['email'], ['uid'], ['email', 'uid']]
    # func2(y)
    func1()
else:
    pass
